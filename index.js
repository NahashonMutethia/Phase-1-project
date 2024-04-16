document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('symptomForm');
    const symptomIdField = document.getElementById('symptomId');
    const symptomName = document.getElementById('symptomName');
    const labWork = document.getElementById('labWork');
    const diagnosis = document.getElementById('diagnosis');
    const treatment = document.getElementById('treatment');
    const formHeading = document.getElementById('formHeading');
    const submitBtn = document.getElementById('submitBtn');
    const symptomSection = document.getElementById('symptom');

    function fetchSymptoms() {
        fetch('http://localhost:3000/medicalSymptoms')
            .then(response => response.json())
            .then(symptoms => displaySymptoms(symptoms))
            .catch(error => console.error('Error fetching symptoms:', error));
    }

    function displaySymptoms(symptoms) {
        symptomSection.innerHTML = '';
        symptoms.forEach(symptom => {
            const symptomDiv = document.createElement('div');
            symptomDiv.classList.add('symptom');
            symptomDiv.innerHTML = `
                <div class="symptom-details">
                    <h3>${symptom.symptom}</h3>
                    <p>Lab Work: ${symptom.labRequirement}</p>
                    <p>Diagnosis: ${symptom.diagnosis}</p>
                    <p>Treatment: ${symptom.treatment}</p>
                </div>
                <button class="edit-btn" data-id="${symptom.id}">Edit</button>
                <button class="delete-btn" data-id="${symptom.id}">Delete</button>
            `;
            symptomSection.appendChild(symptomDiv);
        });
    }

    symptomSection.addEventListener('click', function(e) {
        //  Edit button
        if (e.target.classList.contains('edit-btn')) {
            const symptomId = e.target.getAttribute('data-id');
            editSymptom(symptomId);
        }
    
        //  Delete button
        else if (e.target.classList.contains('delete-btn')) {
            const symptomId = e.target.getAttribute('data-id');
            deleteSymptom(symptomId);
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const symptomData = {
            symptom: symptomName.value,
            labRequirement: labWork.value,
            diagnosis: diagnosis.value,
            treatment: treatment.value
        };

        const method = symptomIdField.value ? 'PUT' : 'POST';
        const url = symptomIdField.value ? `http://localhost:3000/medicalSymptoms/${symptomIdField.value}` : 'http://localhost:3000/medicalSymptoms';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(symptomData),
        })
            .then(() => {
                resetForm();
                fetchSymptoms();
            })
            .catch(error => console.error('Error:', error));
    });

    window.editSymptom = function (symptomId) {
        fetch(`http://localhost:3000/medicalSymptoms/${symptomId}`)
            .then(response => response.json())
            .then(symptom => {
                symptomName.value = symptom.symptom;
                labWork.value = symptom.labRequirement;
                diagnosis.value = symptom.diagnosis;
                treatment.value = symptom.treatment;
                symptomIdField.value = symptom.id;
                formHeading.textContent = 'Edit Symptom';
                submitBtn.textContent = 'Save Changes';
            })
            .catch(error => console.error('Error fetching symptom:', error));
    };

    window.deleteSymptom = function (symptomId) {
        fetch(`http://localhost:3000/medicalSymptoms/${symptomId}`, { method: 'DELETE' })
            .then(() => {
                console.log('Symptom deleted');
                fetchSymptoms(); 
            })
            .catch(error => console.error('Error deleting symptom:', error));
    };

    function resetForm() {
        formHeading.textContent = 'Add New Symptom';
        submitBtn.textContent = 'Add Symptom';
        form.reset();
        symptomIdField.value = '';
    }

    fetchSymptoms();
});
