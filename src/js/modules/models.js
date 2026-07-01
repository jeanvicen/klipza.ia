/* ==========================================
   klipza.ia - Model System
   ========================================== */

const ModelSystem = {
    currentModel: 'lite',

    selectModel(model) {
        if (model === 'prime') {
            showToast('klipza.prime em desenvolvimento. Em breve disponivel!');
            return;
        }

        this.currentModel = model;

        document.querySelectorAll('.model-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.dataset.model === model) {
                opt.classList.add('selected');
            }
        });

        this.closeDropdown();
        Storage.set('klipza_model', model);
    },

    toggleDropdown() {
        const dropdown = document.getElementById('modelDropdown');
        if (dropdown) dropdown.classList.toggle('active');
    },

    closeDropdown() {
        const dropdown = document.getElementById('modelDropdown');
        if (dropdown) dropdown.classList.remove('active');
    },

    init() {
        const saved = Storage.get('klipza_model');
        if (saved) {
            this.currentModel = saved;
            document.querySelectorAll('.model-option').forEach(opt => {
                opt.classList.remove('selected');
                if (opt.dataset.model === saved) {
                    opt.classList.add('selected');
                }
            });
        }
    }
};
