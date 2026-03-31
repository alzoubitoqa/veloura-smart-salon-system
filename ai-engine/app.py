import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from smart_analysis import generate_smart_summary

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI Engine is running"
    })

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json() or {}

    clients = data.get("clients", [])
    appointments = data.get("appointments", [])
    inventory = data.get("inventory", [])

    result = generate_smart_summary(clients, appointments, inventory)
    return jsonify(result)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)