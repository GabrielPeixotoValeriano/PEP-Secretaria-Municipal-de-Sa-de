document.addEventListener('DOMContentLoaded', function() {
    const unitDetails = {
      "HOSPITAL MUNICIPAL SÃO MIGUEL - TIDE SETUBAL": "RUA DR JOSÉ GUILHERME EIRAS, 123 - SÃO MIGUEL PAULISTA<br>CEP: 08010-220 - FONE: 5178-1250",
      "PA MUNICIPAL GLÓRIA RODRIGUES DOS SANTOS BONFIM": "AVENIDA DOS METALURGICOS, 2820 - CIDADE TIRADENTES<br>CEP: 08471-004 - FONE: 2558-3252",  
      "PA MUNICIPAL SÃO MATEUS II": "RUA MAESTRO JOÃO BALAN, 88 - CIDADE SÃO MATEUS<br>CEP: 03963-030 - FONE: 2013-1346 / 2919-6018",
      "PSM JULIO TUPY": "RUA SERRA DA QUEIMADA, 800 - PQ GUAIANASES<br>CEP: 08431-640 - FONE: 2511-6665 / 2035-9475",
      "UPA CIDADE TIRADENTES": "RUA IGARAPE DA DIANA, 1 - CONJ. HAB. INACIO MONTEIRO<br>CEP: 08472-170 - FONE: 5555-7348",
      "UPA ERMELINO MATARAZZO": "RUA MIGUEL NOVAIS, 113 - VILA PARANAGUA<br>CEP: 03807-370 - FONE: 2574-3343",
      "UPA 26 DE AGOSTO": "AVENIDA MIGUEL IGNACIO CURI, 41 - ITAQUERA<br>CEP: 08295-005 - FONE: 4780-5081 / 2070-6456",
      "UPA TITO LOPES": "AVENIDA PIRES DO RIO, 294 - VILA AMERICANA<br>CEP: 08020-000 - FONE: 4780-5114",
      "UPA JARDIM HELENA": "AVENIDA KUMAKI AOKI, 785 - JARDIM HELENA<br>CEP: 08090-37 - FONE: 3195-8140 / 2586-3812",
      "UPA DR. ATUALPA GIRÃO RABELO": "RUA ILHA DO ARVOREDO, 10- VILA MORGADOURO<br>CEP: 08140-270 - FONE: 2562-0270",
      "HOSPITAL MUNICIPAL ITAQUERA/PLANALTO - PROF. DR. WALDOMIRO DE PAULA": "RUA AUGUSTO CARLOS BAUMANN, 1074 - ITAQUERA<br>CEP: 08210-590 - FONE: 5178-0500",
      "CTA CIDADE TIRADENTES": "RUA MILAGRE DOS PEIXES, 357 - CIDADE TIRADENTES<br>CEP: 08474-120 - FONE: 5237-8585",
      "CTA DR. SÉRGIO AROUCA (ITAIM PAULISTA)": "RUA VALENTE NOVAIS, 131 - ITAIM PAULISTA<br>CEP: 08120-420 - FONE: 5237-8635 | 5237-8636",
      "CTA GUAIANASES": "RUA CENTRALINA, 168 - GUAIANASES<br>CEP: 08410-100 - FONE: 5237-8596",
      "CTA SÃO MIGUEL": "RUA JOSÉ ALDO PIASSI, 85 - SÃO MIGUEL PAULISTA<br>CEP: 08011-300 - FONE: 5237-8626 | 5237-8621",
      "SAE CIDADE LÍDER II": "RUA MÉDIO IGUAÇU, 86 - CIDADE LÍDER<br>CEP: 08285-130 - FONE: 5237-8892 | 5237-8893",
      "SAE FIDÉLIS RIBEIRO": "RUA PEIXOTO, 100 - VILA FIDÉLIS RIBEIRO<br>CEP: 03627-010 - FONE: 5237-8932",
      "SAE SÃO MATEUS": "AVENIDA MATEO BEI, 838 - SÃO MATEUS<br>CEP: 03949-000 - FONE: 5237-8915"
      };

    const medicines = {
        'Dolutegravir (DTG) 5mg': {
            dose_infantil: [
                { min: 4, max: 6, dose: 5 },
                { min: 6, max: 10, dose: 15 },
                { min: 10, max: 14, dose: 20 },
                { min: 14, max: 20, dose: 25 }
            ]
        },
        'Dolutegravir (DTG) 50mg': {
            dose_infantil: [
                { min: 20, max: Infinity, dose: 50 }
            ]
        },
        'Zidovudina (AZT) 10mg/ml': {
            dose_infantil: [
                { min: 4, max: 9, dose: 12, interval: '12h' },
                { min: 9, max: 30, dose: 9, interval: '12h' },
                { min: 30, max: Infinity, fixedDose: 30, interval: '12h' }
            ]
        },
        'Lamivudina (3TC) 10mg/ml': {
            dose_infantil: [
                { min: 4, max: Infinity, dose: 4, interval: '12h' }
            ]
        }
    };

    function calculateAge(dob) {
        let now = new Date();
        let years = now.getFullYear() - dob.getFullYear();
        let months = now.getMonth() - dob.getMonth();

        if (now.getDate() < dob.getDate()) {
            months--;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months };
    }

    function getGender() {
        const femaleRadio = document.getElementById('feminino');
        const maleRadio = document.getElementById('masculino');
        const ignoredRadio = document.getElementById('ignorado');
        if (femaleRadio && femaleRadio.checked) {
            return 'Feminino';
        } else if (maleRadio && maleRadio.checked) {
            return 'Masculino';
        } else if (ignoredRadio && ignoredRadio.checked) {
            return 'Ignorado';
        }
        return 'Não especificado';
    }


    function hoursSinceExposure(exposure) {
        const now = new Date();
        const diffMs = now - exposure;
        return Math.floor(diffMs / (1000 * 60 * 60));
    }


    function calculateDTG5mgDose(weight) {
        const dose = medicines['Dolutegravir (DTG) 5mg'].dose_infantil.find(d => weight >= d.min && weight < d.max);
        if (dose) {
            let numComprimidos = Math.ceil(dose.dose / 5);
            return { comprimidos: numComprimidos, medication: 'Dolutegravir (DTG) 5mg' };
        }
        return null;
    }

    function calculateDTG50mgDose(weight) {
        if (weight >= 20) {
            return { comprimidos: 1, medication: 'Dolutegravir (DTG) 50mg' };
        }
        return null;
    }

    function calculateAZT10mgmlDose(weight) {
        const doseObj = medicines['Zidovudina (AZT) 10mg/ml'].dose_infantil.find(d => weight >= d.min && weight < d.max);
        if (doseObj) {
            let mlPerDose;
            if (doseObj.fixedDose !== undefined) {
                mlPerDose = doseObj.fixedDose;
            } else {
                let doseMl = doseObj.dose * weight / 10;
                mlPerDose = parseFloat(doseMl.toFixed(1));
            }
            let totalMl = mlPerDose * 2 * 28;
            let bottles = Math.ceil(totalMl / 240);
            return { ml: mlPerDose, medication: 'Zidovudina (AZT) 10mg/ml', interval: doseObj.interval, bottles: bottles };
        }
        return null;
    }

    function calculate3TC10mgmlDose(weight) {
        const dose = medicines['Lamivudina (3TC) 10mg/ml'].dose_infantil.find(d => weight >= d.min);
        if (dose) {
            let doseMl = dose.dose * weight / 10;
            let mlPerDose = parseFloat(doseMl.toFixed(1));
            let totalMl = mlPerDose * 2 * 28;
            let bottles = Math.ceil(totalMl / 240);
            return { ml: mlPerDose, medication: 'Lamivudina (3TC) 10mg/ml', interval: dose.interval, bottles: bottles };
        }
        return null;
    }

    function openModal() {
        const modal = document.getElementById('recipe-modal');
        if (modal) {
            modal.style.display = "block";
        }
    }

    document.querySelector('.close').addEventListener('click', function() {
        const modal = document.getElementById('recipe-modal');
        if (modal) {
            modal.style.display = "none";
        }
    });

    document.getElementById('patient-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const weight = parseFloat(document.getElementById('patient-weight').value);
        const dobValue = document.getElementById('patient-dob').value;
        const expValue = document.getElementById('exposure-datetime').value;
        const contraValue   = document.getElementById('contraindicacao').value;
        if (!dobValue || !expValue) {
            alert('Por favor, preencha a data de nascimento e a data/hora de exposição.');
            return;
        }
        
        const [year, month, day] = dobValue.split('-');
        const dob = new Date(year, month - 1, day);
        const exposure = new Date(expValue);  

        const age = calculateAge(dob);
        const hoursExp = hoursSinceExposure(exposure);

        const healthUnit = document.getElementById('health-unit').value;
        const patientName = document.getElementById('patient-name').value;
        const patientAddress = document.getElementById('patient-address').value;
        const patientGender = getGender();

        if (!weight || !healthUnit || !patientName || !patientGender) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }
    


        let prescriptionHtml = `
            <div class="header">
                <img src="./Imagens/smslogo.png" alt="Logo Prefeitura São Paulo" id="prefeitura-logo-recipe" style="width: 250px; display: block; margin: 0 auto;">
                <p><strong>${healthUnit.toUpperCase()}</strong></p>
                <p>${unitDetails[healthUnit.toUpperCase()] || ""}</p>
            </div>
            <div class="patient-info">
                <p><strong>NOME:</strong> ${patientName.toUpperCase()}</p>
                <p>
                    <strong>DATA DE NASCIMENTO:</strong> ${dob.toLocaleDateString('pt-BR')} &nbsp;&nbsp;
                    <strong>IDADE:</strong> ${age.years} anos e ${age.months} meses
                </p>
                <p>
                    <strong>PESO:</strong> ${weight} kg &nbsp;&nbsp;
                    <strong>SEXO:</strong> ${patientGender.toUpperCase()}
                </p>
                <p><strong>ENDEREÇO:</strong> ${patientAddress.toUpperCase()}</p>
                <p><strong>TEMPO TRANSCORRIDO DESDE A EXPOSIÇÃO:</strong> ${hoursExp} horas</p>
            </div>
        `;

        if (contraValue !== 'nenhuma') {
    prescriptionHtml += `
        <div class="warning" style="background:red;color:white;padding:10px;margin-top:10px;">
            <p><strong>Paciente apresenta contraindicação ao protocolo padrão.</strong></p>
            <p>Para definir a conduta mais adequada, consulte o Protocolo Clínico e Diretrizes Terapêuticas (PCDT) de Profilaxia Pós-Exposição.</p>
            <p><strong>Clique no link abaixo para acessar o manual e verificar a melhor conduta:</strong></p>
            <p>
            <a href="https://www.gov.br/aids/pt-br/central-de-conteudo/pcdts/copy3_of_PCDT_PEP_interativo.pdf"
               target="_blank"
               style="color:white;text-decoration:underline;">
                PCDT PARA PROFILAXIA PÓS-EXPOSIÇÃO (PEP) DE RISCO À INFECÇÃO PELO HIV, IST E HEPATITES VIRAIS
            </a>
        </div>
        <div class="signature-section">
            <div class="date">
                <p><strong>DATA:</strong> ${new Date().toLocaleDateString('pt-BR')} - SÃO PAULO, SP</p>
            </div>
            <div class="signature-line">
                <span>ASSINATURA DO PROFISSIONAL PRESCRITOR</span>
            </div>
        </div>`;
    document.getElementById('recipe-result').innerHTML = prescriptionHtml;
    openModal();
    return;
}



        if (hoursExp > 72) {
            prescriptionHtml += `
                <div class="warning" style="background:red;color:white;padding:10px;margin-top:10px;">
                    <strong>Atenção:</strong> o paciente procurou atendimento após 72 horas da data da exposição. 
                    De acordo com o Protocolo Clínico e Diretrizes Terapêuticas (PCDT) de Profilaxia Pós-Exposição do Ministério da Saúde, 
                    a PEP não é recomendada após esse período, pois sua eficácia não está comprovada.
                </div>
                <div class="signature-section">
                    <div class="date">
                      <p><strong>DATA:</strong> ${new Date().toLocaleDateString('pt-BR')} - SÃO PAULO, SP</p>
                    </div>
                    <div class="signature-line">
                      <span>ASSINATURA DO PROFISSIONAL PRESCRITOR</span>
                    </div>
                </div>
            `;
        } else {

            let treatmentMessage = "";
      
            if (weight < 4) {
                treatmentMessage = "Esquema preferencial de tratamento indicado: PEP RN.";
            } else if (weight >= 35) {
                treatmentMessage = "Esquema preferencial de tratamento indicado: PEP Adulto.";
            }

            if (treatmentMessage !== "") {
                prescriptionHtml += `
                    <div class="treatment-message">
                        <p><strong><span style="background-color: red; color: white;">${treatmentMessage.toUpperCase()}</span></strong></p>
                    </div>
                `;
               
                if (treatmentMessage.toUpperCase().includes("PEP RN")) {
                    prescriptionHtml += `
                        <p><a href="https://azt.aids.gov.br/documentos/siclom_operacional/Solicita%C3%A7%C3%A3o_Medicamentos_Profilaxia_Preven%C3%A7%C3%A3o_transmiss%C3%A3o_vertical_OUTUBRO_2024_DIGIT%C3%81VEL.pdf" target="_blank" style="color: blue; text-decoration: underline;">
                        FORMULÁRIO DE DISPENSAÇÃO DE ARV - PROFILAXIA - TRANSMISSÃO VERTICAL HIV</a></p>
                    `;
                }
                
                if (treatmentMessage.toUpperCase().includes("PEP ADULTO")) {
                    prescriptionHtml += `
                        <div class="prescription">
                            <h3>PRESCRIÇÃO</h3>
                            <ul id="medication-list-recipe">
                                <li><strong>1 - TENOFOVIR (TDF) 300MG/LAMIVUDINA (3TC) 300MG</strong>, tomar <strong>1</strong> comprimido ao dia, durante 28 dias.</li>
                                <li><strong>2 - DOLUTEGRAVIR (DTG) 50MG</strong>, tomar <strong>1</strong> comprimido ao dia, durante 28 dias.</li>
                            </ul>
                        </div>
                    `;
                }
                prescriptionHtml += `
                    <button id="print-btn">Imprimir Receita</button>
                    <div class="signature-section">
                        <div class="date">
                          <p><strong>DATA:</strong> ${new Date().toLocaleDateString('pt-BR')} - SÃO PAULO, SP</p>
                        </div>
                        <div class="signature-line">
                          <span>ASSINATURA DO PROFISSIONAL PRESCRITOR</span>
                        </div>
                    </div>
                `;
            } else {
                const resultDTG5mg = calculateDTG5mgDose(weight);
                const resultDTG50mg = calculateDTG50mgDose(weight);
                const resultAZT10mgml = calculateAZT10mgmlDose(weight);
                const result3TC10mgml = calculate3TC10mgmlDose(weight);

                prescriptionHtml += `<div class="prescription"><h3>Prescrição</h3><ul>`;

                if (resultDTG5mg) {
                    prescriptionHtml += `
                        <li><strong>1 - ${resultDTG5mg.medication.toUpperCase()}</strong>, tomar <strong>${resultDTG5mg.comprimidos}</strong> comprimidos de 5mg diluídos em 5 a 10 ml de água, uma vez ao dia, durante 28 dias.</li>
                    `;
                } else if (resultDTG50mg) {
                    prescriptionHtml += `
                        <li><strong>1 - ${resultDTG50mg.medication.toUpperCase()}</strong>, tomar <strong>${resultDTG50mg.comprimidos}</strong> comprimidos de 50mg, uma vez ao dia, durante 28 dias.</li>
                    `;
                }

                if (resultAZT10mgml) {
                    prescriptionHtml += `
                        <li>
                            <strong>2 - ${resultAZT10mgml.medication.toUpperCase()}</strong>, tomar <strong>${resultAZT10mgml.ml}</strong> ml (de 10mg/ml) a cada ${resultAZT10mgml.interval}, durante 28 dias.<br>
                            Quantidade de frascos necessários: <strong>${resultAZT10mgml.bottles}</strong>.
                        </li>
                    `;
                }

                if (result3TC10mgml) {
                    prescriptionHtml += `
                        <li>
                            <strong>3 - ${result3TC10mgml.medication.toUpperCase()}</strong>, tomar <strong>${result3TC10mgml.ml}</strong> ml (de 10mg/ml) a cada ${result3TC10mgml.interval}, durante 28 dias.<br>
                            Quantidade de frascos necessários: <strong>${result3TC10mgml.bottles}</strong>.
                        </li>
                    `;
                }

                prescriptionHtml += `</ul></div>
                    <button id="print-btn">Imprimir Receita</button>
                    <div class="signature-section">
                        <div class="date">
                          <p><strong>DATA:</strong> ${new Date().toLocaleDateString('pt-BR')} - SÃO PAULO, SP</p>
                        </div>
                        <div class="signature-line">
                          <span>ASSINATURA DO PROFISSIONAL PRESCRITOR</span>
                        </div>
                    </div>
                `;
            }
        }

        const recipeResultDiv = document.getElementById('recipe-result');
        recipeResultDiv.innerHTML = prescriptionHtml;
        openModal();

        document.getElementById('print-btn')?.addEventListener('click', function() {
            let recipeClone = document.getElementById('recipe-result').cloneNode(true);
            recipeClone.querySelector('#print-btn')?.remove();
            let printContent = recipeClone.innerHTML;
            let newWindow = window.open('', '_blank', 'width=800,height=600');
            newWindow.document.write('<html><head><title>Receituário Médico</title>');
            newWindow.document.write('<style>body { font-family: Arial, sans-serif; margin: 20px; text-transform: uppercase; } .header { text-align: center; margin-bottom: 20px; } .signature-section { position: fixed; bottom: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; align-items: center; } .signature-line { border-top: 1px solid #000; width: 200px; }</style>');
            newWindow.document.write('</head><body>' + printContent + '</body></html>');
            newWindow.document.close();
            newWindow.focus();
            newWindow.onload = () => newWindow.print();
        });
    });
});