# YouTube Video Search and Sentiment Analysis

This project is a web application that allows users to search for YouTube videos, display video information, comments, and analyze the sentiments of the comments. The application fetches data from the YouTube API and uses a pre-trained sentiment analysis model to evaluate the comments.

## Features

- Search for YouTube videos based on a query.
- Display the searched video and its title.
- Fetch and display comments of the video.
- Analyze the sentiments of the comments using a pre-trained model.
- Display related and recommended videos.
- Show sentiment statistics for the comments.

## Technologies Used

- HTML, CSS, JavaScript for the frontend.
- Flask for the backend.
- YouTube Data API for fetching video and comment data.
- Pre-trained sentiment analysis model (`w11wo/indonesian-roberta-base-sentiment-classifier`) from the Hugging Face transformers library.
- Flask-CORS for handling Cross-Origin Resource Sharing (CORS).

## Prerequisites

- Python 3.x
- Flask
- Flask-CORS
- Transformers library from Hugging Face
- An API key from the YouTube Data API v3

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/iqbaljntra/Youtube-Sentiment-Analysis
    cd youtube-sentiment-analysis
    ```

2. Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

4. Replace the `apiKey` variable in `app.js` with your YouTube Data API key:
    ```javascript
    const apiKey = 'YOUR_YOUTUBE_API_KEY';
    ```

5. Save the sentiment analysis model as `sentiment_model.joblib` in the project directory.

6. Run the Flask backend server:
    ```bash
    python app.py
    ```

## Usage

1. Open `index.html` in your web browser.

2. Use the search bar to search for a YouTube video.

3. The application will display the video, related and recommended videos, and fetch the comments.

4. The sentiments of the comments will be analyzed and displayed.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements

- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Hugging Face Transformers](https://huggingface.co/w11wo/indonesian-roberta-base-sentiment-classifier)
- [Flask](https://flask.palletsprojects.com/)

## Contact

If you have any questions or suggestions, feel free to contact me at iqbaljntra@gmail.com.
