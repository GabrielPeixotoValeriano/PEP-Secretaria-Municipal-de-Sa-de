
const medicines = [
    {
        id: 1,
        nome: 'Paracetamol',
        dose_recomendada_adulto: 10,  
        dose_recomendada_infantil: 5, 
        intervalo_adulto: 8,  
        intervalo_infantil: 6, 
        duracao: 5,  
        comentario: 'Alívio de dores e febre.' 
    },
    {
        id: 2,
        nome: 'Ibuprofeno',
        dose_recomendada_adulto: 15,
        dose_recomendada_infantil: 7,
        intervalo_adulto: 6,
        intervalo_infantil: 6,
        duracao: 7,
        comentario: 'Anti-inflamatório.' 
    },
    {
        id: 3,
        nome: 'Amoxicilina',
        dose_recomendada_adulto: 20,
        dose_recomendada_infantil: 12,
        intervalo_adulto: 12,
        intervalo_infantil: 8,
        duracao: 10,
        comentario: 'Antibiótico.' 
    }
];


function updateMedicationList() {
    const medicationList = document.getElementById('medication-list');
    
    
    medicationList.innerHTML = '<option value="">Selecione um medicamento</option>';


    medicines.forEach(med => {
        const option = document.createElement('option');
        option.value = med.id;
        option.textContent = `${med.nome}`;
        medicationList.appendChild(option);
    });
}


function calculateDose(medicationId, weight, age) {
    const medication = medicines.find(med => med.id === parseInt(medicationId));

    if (medication) {
        let doseAdulto, doseInfantil, intervaloAdulto, intervaloInfantil;

       
        doseAdulto = medication.dose_recomendada_adulto * weight;
        doseInfantil = medication.dose_recomendada_infantil * weight;
        intervaloAdulto = medication.intervalo_adulto;
        intervaloInfantil = medication.intervalo_infantil;

        
        const comentario = `
            <p><strong>Para uso adulto:</strong></p>
            <p>- A dose recomendada é de <strong>${doseAdulto.toFixed(2)} mg</strong>, calculada com base no peso do paciente (<strong>${medication.dose_recomendada_adulto} mg por kg</strong>).</p>
            <p>- O intervalo entre as doses é de <strong>${intervaloAdulto} horas</strong>.</p>
            <p>- O tratamento deve ser feito por <strong>${medication.duracao} dias</strong>.</p>
            <br>
            <p><strong>Para uso infantil:</strong></p>
            <p>- A dose recomendada é de <strong>${doseInfantil.toFixed(2)} mg</strong>, calculada com base no peso do paciente (<strong>${medication.dose_recomendada_infantil} mg por kg</strong>).</p>
            <p>- O intervalo entre as doses é de <strong>${intervaloInfantil} horas</strong>.</p>
            <p>- O tratamento deve ser feito por <strong>${medication.duracao} dias</strong>.</p>
            <br>
            <p><strong>Observação:</strong> ${medication.comentario}</p>
        `;

        return comentario;
    }
    return null;
}


document.getElementById('patient-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const medicationId = document.getElementById('medication-list').value;
    const weight = parseFloat(document.getElementById('patient-weight').value);
    const age = parseInt(document.getElementById('patient-age').value);

    
    if (!medicationId || !weight || !age) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }


    const result = calculateDose(medicationId, weight, age);

    if (result) {
        
        const doseResultDiv = document.getElementById('dose-result');
        doseResultDiv.innerHTML = result;
        doseResultDiv.style.display = 'block'; 
    }
});


updateMedicationList();
