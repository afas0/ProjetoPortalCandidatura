import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AvaliarCandidatura.css';

const AvaliarCandidatura = ({ applicationKey }) => {
    const [notaAcademica, setNotaAcademica] = useState('');
    const [notaProfissional, setNotaProfissional] = useState('');
    const [pesoAcademico, setPesoAcademico] = useState('');
    const [pesoProfissional, setPesoProfissional] = useState('');
    const [comentario, setComentario] = useState('');
    const navigate = useNavigate();
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
        // Verifica se todos os campos est�o preenchidos
        if (
            notaAcademica !== '' &&
            notaProfissional !== '' &&
            pesoAcademico !== '' &&
            pesoProfissional !== '' &&
            comentario !== ''
        ) {
            // Gera uma chave �nica para a avalia��o
            const newKey = `avaliacao_${Date.now()}`;
            const id = applicationKey;
            // Salva os dados da avalia��o no localStorage
            const formData = {
                id,
                notaAcademica,
                notaProfissional,
                pesoAcademico,
                pesoProfissional,
                comentario
            };
            localStorage.setItem(newKey, JSON.stringify(formData));
            // para alterar o estado para avaliado depois de clicar no butao
            const application = JSON.parse(localStorage.getItem(applicationKey)); 
            if (application) {
                application.estado = "Avaliado";
                localStorage.setItem(applicationKey, JSON.stringify(application));
            }
            alert('Avalia��o enviada com sucesso!');

            // Limpa o formul�rio ap�s o envio
            setNotaAcademica('');
            setNotaProfissional('');
            setPesoAcademico('');
            setPesoProfissional('');
            setComentario('');
            navigate('/interface-docente');
        } else {
            alert('Por favor, preencha todos os campos antes de enviar a avalia��o.');
        }
    };

    return (
        <div className="avaliar-candidatura-container">
            <h3>Avaliar Candidatura</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nota Academica:</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={notaAcademica}
                        onChange={(e) => setNotaAcademica(e.target.value)}
                    />
                </div>
                <div>
                    <label>Nota Profissional:</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={notaProfissional}
                        onChange={(e) => setNotaProfissional(e.target.value)}
                    />
                </div>
                <div>
                    <label>Peso Academico:</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={pesoAcademico}
                        onChange={(e) => setPesoAcademico(e.target.value)}
                    />
                </div>
                <div>
                    <label>Peso Profissional:</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={pesoProfissional}
                        onChange={(e) => setPesoProfissional(e.target.value)}
                    />
                </div>
                <div>
                    <label>Comentario:</label>
                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit">Enviar Avaliacao</button>
            </form>
        </div>
    );
};

export default AvaliarCandidatura;