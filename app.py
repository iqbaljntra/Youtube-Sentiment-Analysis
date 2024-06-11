from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)  # Tambahkan ini untuk mengizinkan CORS

# Muat model menggunakan joblib
nlp = joblib.load('sentiment_model.joblib')

@app.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.get_json()
        comments = data['comments']
        print(f'Received comments: {comments}')  # Log untuk debugging
        sentiments = [nlp.predict([comment])[0] for comment in comments]  # Prediksi sentimen untuk setiap komentar
        print(f'Sentiments: {sentiments}')  # Log untuk debugging
        return jsonify({'sentiments': sentiments, 'comments': comments})
    except Exception as e:
        print(f'Error: {str(e)}')  # Log kesalahan
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
