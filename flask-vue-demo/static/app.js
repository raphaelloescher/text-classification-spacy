const app = Vue.createApp({
    data() {
        return {
            incident: '',
            recommendations: [],
            loading: false,
            metrics: {}
        };
    },
    methods: {
        async submitIncident() {
            if (!this.incident.trim()) {
                alert("Please describe the incident before submitting.");
                return;
            }
            
            this.loading = true;
            this.recommendations = [];

            try {
                const response = await fetch('/api/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ description: this.incident })
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch recommendations.");
                }

                const data = await response.json();
                console.log(data.predictions)

                const formatted_categories = data.predictions.map(prediction => `${prediction[0]} (${(prediction[1] * 100).toFixed(2)}%)`);
                

                
                this.recommendations = formatted_categories;
            } catch (error) {
                alert("Error fetching recommendations.");
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        async fetchMetrics() {
            const response = await fetch('/api/metrics');
            const data = await response.json();
            this.metrics = data;
        },
        // Open Modal for Metrics
        showMetrics() {
            this.fetchMetrics();
            const modal = new bootstrap.Modal(document.getElementById('metricsModal'));
            modal.show();
        },
        // Fill textarea with example descriptions
        fillExample(exampleText) {
            this.incident = exampleText;
        }
    }
});

app.mount('#app');