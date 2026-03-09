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
    data = request.get_json()

    clients = data.get("clients", [])
    appointments = data.get("appointments", [])
    inventory = data.get("inventory", [])

    result = generate_smart_summary(clients, appointments, inventory)
    return jsonify(result)


if __name__ == "__main__":
    app.run(port=8000, debug=True)