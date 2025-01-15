from flask import Flask, request, jsonify, render_template
import spacy

# Initialize Flask app
app = Flask(__name__)

# Load the spaCy model
model_path = "./spacy-text-classification"
nlp = spacy.load(model_path)

# Route to render the main page
@app.route('/')
def index():
    return render_template('index.html')

@app.route("/api/predict", methods=["POST"])
def predict():
    # Get the text input from the JSON request
    data = request.get_json()
    if not data or "description" not in data:
        return jsonify({"error": "Please provide 'description' in the request body"}), 400

    text = data["description"]

    # Use the model for prediction
    doc = nlp(text)
    # Prepare the response
    sorted_cats = sorted(doc.cats.items(), key=lambda x: x[1], reverse=True)[:5]
    top_predictions = {'text': text, 'predictions': sorted_cats}

    return jsonify(top_predictions)

if __name__ == "__main__":
    app.run(debug=True)