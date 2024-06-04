import React, { useState, useEffect } from 'react';
import './InterfaceDocente.css';
import { useNavigate } from 'react-router-dom';

const InterfaceDocente = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [itemSelected, setItemSelected] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [allCandidaturesEvaluated, setAllCandidaturesEvaluated] = useState(false);
    const navigate = useNavigate();
    const[pesoAcademico, setPesoAcademico] = useState(() => {
        const storedParametros = localStorage.getItem('parametros');
        return storedParametros ? JSON.parse(storedParametros).pesoAcademico : 50;
    });
    const [pesoProfissional, setPesoProfissional] = useState(() => {
        const storedParametros = localStorage.getItem('parametros');
        return storedParametros ? JSON.parse(storedParametros).pesoProfissional : 50;
    });
    const [vagas, setVagas] = useState(() => {
        const storedParametros = localStorage.getItem('parametros');
        return storedParametros ? JSON.parse(storedParametros).vagas : 1;
    });
    const checkAllCandidaturesEvaluated = () => {
        const allEvaluated = filteredApplications.every(app => app.estado.toLowerCase() === 'avaliado');
        setAllCandidaturesEvaluated(allEvaluated);

    };

    useEffect(() => {
        const storedApplications = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("candidatura_")) {
                const applicationData = JSON.parse(localStorage.getItem(key));
                storedApplications.push(applicationData);
            }
        }
        setApplications(storedApplications);
        setFilteredApplications(storedApplications);
        checkAllCandidaturesEvaluated();
    }, []);

    useEffect(() => {
        const parametros = {
            pesoAcademico,
            pesoProfissional,
            vagas
        };
        localStorage.setItem('parametros', JSON.stringify(parametros));
       recalculateFinalGrades(parametros);
    }, [pesoAcademico, pesoProfissional, vagas]);

    const recalculateFinalGrades = (parametros) => {
        //const updatedApplications = [];
        for (let i = 0; i < localStorage.length; i++) {
            const avaliacaoKey = localStorage.key(i);
            if (avaliacaoKey.startsWith("avaliacao_")) {
                const avaliacaoData = JSON.parse(localStorage.getItem(avaliacaoKey));
                const candidaturaKey = avaliacaoData.id;
               
                
                if (candidaturaKey) {
                    const notaAcademica = parseFloat(avaliacaoData.notaAcademica);
                    //alert(notaAcademica)
                    const notaProfissional = parseFloat(avaliacaoData.notaProfissional);
                    const notaFinal = (notaAcademica * (parametros.pesoAcademico / 100)) + (notaProfissional * (parametros.pesoProfissional / 100));

                    const updatedCandidatura = { ...avaliacaoData, notaFinal };
                    
                    localStorage.setItem(avaliacaoKey, JSON.stringify(updatedCandidatura));
                    const candidaturaData = JSON.parse(localStorage.getItem(candidaturaKey));
                    if (candidaturaData) {
                        candidaturaData.notafinal = notaFinal;
                        
                        localStorage.setItem(candidaturaKey, JSON.stringify(candidaturaData));
                    }

                }
            }
        }
        
        //for (let i = 0; i < localStorage.length; i++) {
        //    const candidaturaKey = localStorage.key(i);
        //    if (candidaturaKey.startsWith("candidatura_")) {
        //        const candidaturaData = JSON.parse(localStorage.getItem(candidaturaKey));
        //        updatedApplications.push(candidaturaData);
        //    }
        //}
        //updatedApplications.push(candidaturaData);
        //setApplications(updatedApplications);
        //setFilteredApplications(updatedApplications);
        //checkAllCandidaturesEvaluated();
    };
    

    const handleApplicationSelect = (application, index) => {
        setSelectedApplication(application);
        setSelectedIndex(index);
        setItemSelected(true);
    };

    const sortApplications = (order) => {
        const sortedApplications = [...filteredApplications].sort((a, b) => {
            const notaA = parseFloat(a.mediaCurso);
            const notaB = parseFloat(b.mediaCurso);
            return order === 'asc' ? notaA - notaB : notaB - notaA;
        });
        setFilteredApplications(sortedApplications);
        setSortOrder(order);
    };

    const handleNewComponent = () => {
        if (itemSelected) {
            navigate(`/detalhes-candidatura/${selectedIndex}`);
        }
    };

    const handleDoubleClick = () => {
        if (itemSelected) {
            navigate(`/detalhes-candidatura/${selectedIndex}`);
        }
    };
    //para finalizar o processo
    const handleFinalizeProcess = () => {

        const newKey = "estadoConcurso"
        // Adicionando o novo campo ao formulário antes de enviar
        const formDataWithStatus = {estado : "Fechado"};
        // Guarda os dados atualizados no localStorage
        localStorage.setItem(newKey, JSON.stringify(formDataWithStatus));
        alert("sucesso");
    };

    const filterApplications = (filter) => {
        let filtered = applications;
        if (filter === 'approved') {
            filtered = applications.filter(app => app.estado.toLowerCase() === 'avaliado');
        } else if (filter === 'pending') {
            filtered = applications.filter(app => app.estado.toLowerCase() === 'nao avaliado');
        } else {
            filtered = applications;
        }
        setFilteredApplications(filtered);

    };

    const handleSettingsToggle = () => {
        setShowSettings(!showSettings);
        if (!showSettings) {
            const storedParametros = localStorage.getItem('parametros');
            if (storedParametros) {
                const parametros = JSON.parse(storedParametros);
                setPesoAcademico(parametros.pesoAcademico || 50);
                setPesoProfissional(parametros.pesoProfissional || 50);
                setVagas(parametros.vagas || 1);
            }
        }
    };

    return (
        <div className="interface-docente-container">
            <div className="header">
                <h2>Lista de Candidaturas</h2>
            </div>
            <div className="buttons-container">
                <button onClick={() => sortApplications(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    Ordenar por Nota ({sortOrder === 'asc' ? 'Ascendente' : 'Descendente'})
                </button>
                <button onClick={handleNewComponent} disabled={!itemSelected}>
                    Abrir Detalhes
                </button>
                <button onClick={() => filterApplications('all')}>
                    Todas Candidaturas
                </button>
                <button onClick={() => filterApplications('pending')}>
                    Candidaturas por Avaliar
                </button>
                <button onClick={() => filterApplications('approved')}>
                    Candidaturas Avaliadas
                </button>
                <button
                    onClick={handleFinalizeProcess}
                    disabled={!allCandidaturesEvaluated}
                >
                    Finalizar Processo
                </button>
            </div>
            <div className="settings-button-container">
                <button onClick={handleSettingsToggle}>Configurações Avaliação</button>
            </div>

            {showSettings && (
                <div className="settings-modal">
                    <div className="settings-header">
                        <h3>Configurações</h3>
                        <button className="close-button" onClick={handleSettingsToggle}>
                            &times;
                        </button>
                    </div>
                    <div className="settings-content">
                        <label>
                            Peso Académico:
                            <div className="range-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={pesoAcademico}
                                    onChange={(e) => {
                                        const newValue = parseInt(e.target.value);
                                        setPesoAcademico(newValue);
                                        setPesoProfissional(100 - newValue);
                                    }}
                                />
                                <span className="range-value">{pesoAcademico}%</span>
                            </div>
                        </label>
                        <label>
                            Peso Profissional:
                            <div className="range-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={pesoProfissional}
                                    onChange={(e) => {
                                        const newValue = parseInt(e.target.value);
                                        setPesoProfissional(newValue);
                                        setPesoAcademico(100 - newValue);
                                    }}
                                />
                                <span className="range-value">{pesoProfissional}%</span>
                            </div>
                        </label>
                        <label>
                            Vagas:
                            <div className="range-container">
                                <input
                                    type="number"
                                    min="1"
                                    value={vagas}
                                    onChange={(e) => {
                                        const newValue = parseInt(e.target.value);
                                        setVagas(newValue);
                                    }}
                                />
                            </div>
                        </label>
                    </div>
                </div>
            )}

            <ul>
                {filteredApplications.map((application, index) => (
                    <li
                        key={index}
                        className={`application-item ${selectedApplication === application ? 'selected' : ''}`}
                        onClick={() => handleApplicationSelect(application, index)}
                        onDoubleClick={handleDoubleClick}
                    >
                        <p><strong>Nome:</strong> {application.nomeCompleto}</p>
                        <p><strong>Media de curso:</strong> {application.mediaCurso}</p>
                        <p><strong>Email:</strong> {application.email}</p>
                        <p><strong>Título de Graduação:</strong> {application.tituloGraduacao}</p>
                        <p><strong>Estado:</strong> {application.estado}</p>
                        <p><strong>Nota Candidatura:</strong> {application.notafinal}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InterfaceDocente;