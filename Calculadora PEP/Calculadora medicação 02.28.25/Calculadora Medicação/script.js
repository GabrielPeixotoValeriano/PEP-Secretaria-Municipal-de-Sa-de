document.addEventListener('DOMContentLoaded', function() {
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
                { min: 9, max: 30, dose: 9, interval: '12h' }
            ]
        },
        'Zidovudina (AZT) 100mg': {
            dose_infantil: [
                { min: 30, max: Infinity, dose: 300, interval: '12h' }
            ]
        },
        'Lamivudina (3TC) 10mg/ml': {
            dose_infantil: [
                { min: 4, max: Infinity, dose: 4, interval: '12h' }
            ]
        }
    };

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
        const dose = medicines['Zidovudina (AZT) 10mg/ml'].dose_infantil.find(d => weight >= d.min && weight < d.max);
        if (dose) {
            let doseMl = dose.dose * weight / 10;
            let mlPerDose = parseFloat(doseMl.toFixed(1));
            let totalMl = mlPerDose * 2 * 28;
            let bottles = Math.ceil(totalMl / 240);
            return { ml: mlPerDose, medication: 'Zidovudina (AZT) 10mg/ml', interval: dose.interval, bottles: bottles };
        }
        return null;
    }

    function calculateAZT100mgDose(weight) {
        if (weight >= 30) {
            return { comprimidos: 3, medication: 'Zidovudina (AZT) 100mg', interval: '12h' };
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

    function getGender() {
        const femaleRadio = document.getElementById('feminino');
        const maleRadio = document.getElementById('masculino');
        if (femaleRadio && femaleRadio.checked) {
            return 'Feminino';
        } else if (maleRadio && maleRadio.checked) {
            return 'Masculino';
        }
        return 'Não especificado';
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
        if (!dobValue) {
            alert('Por favor, preencha a data de nascimento.');
            return;
        }
        // Separar os componentes da data para criar um objeto Date local
        const [year, month, day] = dobValue.split('-');
        const dob = new Date(year, month - 1, day);

        const today = new Date();
        let ageInMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
        if (today.getDate() < dob.getDate()) {
            ageInMonths--;
        }
        let ageInYears = Math.floor(ageInMonths / 12);

        const healthUnit = document.getElementById('health-unit').value;
        const patientName = document.getElementById('patient-name').value;
        const patientAddress = document.getElementById('patient-address').value;
        const patientGender = getGender();

        if (!weight || ageInMonths < 0 || !healthUnit || !patientName || !patientAddress || !patientGender) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        let treatmentMessage = "";
        if (ageInMonths <= 1 || weight < 4) {
            treatmentMessage = "Esquema preferencial de tratamento indicado: PEP Gestante.";
        } else if (ageInMonths > 72 || weight >= 35) {
            treatmentMessage = "Esquema preferencial de tratamento indicado: PEP Adulto.";
        }

        const dobFormatted = dob.toLocaleDateString('pt-BR');

        const recipeResultDiv = document.getElementById('recipe-result');
        let prescriptionHtml = '';
        prescriptionHtml += `
            <div class="header">
                <img src="./Imagens/smslogo.png" alt="Logo Prefeitura São Paulo" id="prefeitura-logo-recipe" style="width: 250px; display: block; margin: 0 auto;">
                <p><strong>${healthUnit.toUpperCase()}</strong></p>
            </div>
        `;
        prescriptionHtml += `
            <div class="patient-info">
                <p><strong>PACIENTE:</strong> ${patientName.toUpperCase()}</p>
                <p>
                    <strong>DATA DE NASCIMENTO:</strong> ${dobFormatted} &nbsp;&nbsp;
                    <strong>IDADE:</strong> ${ageInYears} anos
                </p>
                <p>
                    <strong>PESO:</strong> ${weight} kg &nbsp;&nbsp;
                    <strong>SEXO:</strong> ${patientGender.toUpperCase()}
                </p>
                <p><strong>ENDEREÇO:</strong> ${patientAddress.toUpperCase()}</p>
            </div>
        `;

        if (treatmentMessage !== "") {
            prescriptionHtml += `
                <div class="treatment-message">
                    <p><strong><span style="background-color: red; color: white;">${treatmentMessage.toUpperCase()}</span></strong></p>
                </div>
                <button id="print-btn">Imprimir Receita</button>
                <div class="signature-section">
                    <div class="signature-line">
                        <span>ASSINATURA DO MÉDICO</span>
                    </div>
                    <div class="date">
                        <p><strong>DATA:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            `;
        } else {
            let resultDTG5mg = calculateDTG5mgDose(weight);
            let resultDTG50mg = calculateDTG50mgDose(weight);
            let resultAZT10mgml = calculateAZT10mgmlDose(weight);
            let resultAZT100mg = calculateAZT100mgDose(weight);
            let result3TC10mgml = calculate3TC10mgmlDose(weight);

            prescriptionHtml += `
                <div class="prescription">
                    <h3>PRESCRIÇÃO</h3>
                    <ul id="medication-list-recipe">
            `;

            if (resultDTG5mg) {
                prescriptionHtml += `<li><strong>1 - ${resultDTG5mg.medication.toUpperCase()}</strong>, tomar <strong>${resultDTG5mg.comprimidos}</strong> comprimidos de 5mg, uma vez ao dia, durante 28 dias.</li>`;
            } else if (resultDTG50mg) {
                prescriptionHtml += `<li><strong>1 - ${resultDTG50mg.medication.toUpperCase()}</strong>, tomar <strong>${resultDTG50mg.comprimidos}</strong> comprimidos de 50mg, uma vez ao dia, durante 28 dias.</li>`;
            }

            if (resultAZT10mgml) {
                prescriptionHtml += `<li>
                    <strong>2 - ${resultAZT10mgml.medication.toUpperCase()}</strong>, tomar <strong>${resultAZT10mgml.ml}</strong> ml (de 10mg/ml) a cada ${resultAZT10mgml.interval}, durante 28 dias.<br>
                    Quantidade de frascos necessários: <strong>${resultAZT10mgml.bottles}</strong>.
                </li>`;
            } else if (resultAZT100mg) {
                prescriptionHtml += `<li><strong>2 - ${resultAZT100mg.medication.toUpperCase()}</strong>, tomar <strong>${resultAZT100mg.comprimidos}</strong> comprimidos de 100mg a cada ${resultAZT100mg.interval}, durante 28 dias.</li>`;
            }

            if (result3TC10mgml) {
                prescriptionHtml += `<li>
                    <strong>3 - ${result3TC10mgml.medication.toUpperCase()}</strong>, tomar <strong>${result3TC10mgml.ml}</strong> ml (de 10mg/ml) a cada ${result3TC10mgml.interval}, durante 28 dias.<br>
                    Quantidade de frascos necessários: <strong>${result3TC10mgml.bottles}</strong>.
                </li>`;
            }

            prescriptionHtml += `
                    </ul>
                </div>
            `;

            if ((resultAZT10mgml && resultAZT10mgml.bottles > 1) || (result3TC10mgml && result3TC10mgml.bottles > 1)) {
                prescriptionHtml += `<p style="color: red; font-weight: bold;">O PACIENTE DEVE SE DIRIGIR A UM SAE PARA A RETIRADA DAS DOSES COMPLEMENTARES.</p>`;
            }

            prescriptionHtml += `
                <button id="print-btn">Imprimir Receita</button>
                <div class="signature-section">
                    <div class="signature-line">
                        <p><strong>DATA:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    <div class="date">
                        
                        <span>ASSINATURA DO MÉDICO</span>
                    </div>
                </div>
            `;
        }

        recipeResultDiv.innerHTML = prescriptionHtml;
        openModal();

        document.getElementById('print-btn').addEventListener('click', function() {
            let recipeClone = document.getElementById('recipe-result').cloneNode(true);
            let printButton = recipeClone.querySelector('#print-btn');
            if (printButton) {
                printButton.parentNode.removeChild(printButton);
            }
            let printContent = recipeClone.innerHTML;
            let newWindow = window.open('', '_blank', 'width=800,height=600');
            newWindow.document.write('<html><head><title>Receituário Médico</title>');
            newWindow.document.write('<style>');
            newWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; text-transform: uppercase; }');
            newWindow.document.write('.header { text-align: center; margin-bottom: 20px; }');
            newWindow.document.write('.header img { width: 30%; }');
            newWindow.document.write('.header p { font-weight: bold; }');
            newWindow.document.write('.patient-info p { margin: 0; }');
            newWindow.document.write('.prescription { margin-bottom: 20px; }');
            newWindow.document.write('.signature-section { position: fixed; bottom: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; align-items: center; }');
            newWindow.document.write('.signature-line { border-top: 1px solid #000; width: 200px; }');
            newWindow.document.write('</style>');
            newWindow.document.write('</head><body>');
            newWindow.document.write(printContent);
            newWindow.document.write('</body></html>');
            newWindow.document.close();
            newWindow.focus();
            newWindow.print();
        });
    });
});
