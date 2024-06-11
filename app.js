const apiKey = 'AIzaSyCoPw9pdDULrZz3HyL4vunwoJirsxzvTGs';
const searchApiEndpoint = 'https://youtube.googleapis.com/youtube/v3/search';
const commentApiEndpoint = 'https://youtube.googleapis.com/youtube/v3/commentThreads';
const sentimentsApiEndpoint = 'http://127.0.0.1:5000/analyze_sentiment'; // Endpoint untuk analisis sentimen
document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    await searchYouTube(query);
});

async function searchYouTube(query) {
    try {
        const response = await fetch(`${searchApiEndpoint}?part=snippet&maxResults=10&q=${query}&type=video&key=${apiKey}`);
        const data = await response.json();

        if (data.items.length === 0) {
            throw new Error('No results found');
        }

        const videoId = data.items[0].id.videoId;
        const title = data.items[0].snippet.title;

        
        displayVideo(videoId, title);
        await fetchComments(videoId);
        fetchRelatedVideos(videoId);
        fetchRecommendedVideos(query);
        await analyzeComments(videoId); // Panggil fungsi untuk menganalisis komentar
    } catch (error) {
        console.error('Error:', error);
        displayError('Failed to fetch search results');
    }
}

function playVideo(videoId) {
    const playerContainer = document.getElementById('video');
    playerContainer.innerHTML = `
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">Watch Video on YouTube</a>
    `;
}


async function analyzeComments(videoId) {
    try {
        const response = await fetch(sentimentsApiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ videoId: videoId }) // Kirim videoId ke backend untuk analisis sentimen
        });
        const data = await response.json();
        displaySentiments(data);
    } catch (error) {
        console.error('Error:', error);
        displayError('Failed to analyze comments');
    }
}

async function displayComments(comments) {
    const commentsContainer = document.getElementById('comments');
    commentsContainer.innerHTML = '<h2>Comments</h2>';
    for (const comment of comments) {
        const commentText = comment.snippet.topLevelComment.snippet.textOriginal;
        const sentiment = await analyzeSentiment(commentText); // Menunggu hasil analisis sentimen sebelum menampilkan komentar
        displayComment(comment.snippet.topLevelComment.snippet.authorDisplayName, commentText, sentiment);
    }
}

async function displaySentiments(sentiments) {
    const sentimentsContainer = document.getElementById('sentiments');
    sentimentsContainer.innerHTML = '<h2>Sentiments</h2>';
    
    // Sorting sentimen berdasarkan skor dari tinggi ke rendah
    sentiments.sort((a, b) => b.score - a.score);
    
    // Membuat variabel untuk menyimpan sentimen tertinggi
    const highestSentiment = sentiments[0];

    // Menampilkan sentimen tertinggi
    displaySentiment(highestSentiment);
}

async function fetchComments(videoId) {
    const maxResults = 100; // Jumlah maksimum komentar per halaman
    let comments = []; // Array untuk menyimpan semua komentar

    // Fungsi rekursif untuk mengambil semua komentar
    async function fetchCommentsRecursive(pageToken) {
        let url = `${commentApiEndpoint}?part=snippet&maxResults=${maxResults}&videoId=${videoId}&key=${apiKey}`;
        if (pageToken) {
            url += `&pageToken=${pageToken}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            comments = comments.concat(data.items); // Menambahkan komentar baru ke array

            // Jika masih ada halaman berikutnya, panggil fungsi ini lagi
            if (data.nextPageToken) {
                await fetchCommentsRecursive(data.nextPageToken);
            } else {
                // Jika tidak ada halaman berikutnya, tampilkan semua komentar
                displayComments(comments);
            }
        } catch (error) {
            console.error('Error:', error);
            displayError('Failed to fetch comments');
        }
    }

    // Memulai panggilan rekursif dengan token halaman awal null
    await fetchCommentsRecursive(null);
}

function fetchRelatedVideos(videoId) {
    fetch(`${searchApiEndpoint}?part=snippet&maxResults=8&type=video&relatedToVideoId=${videoId}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayRelatedVideos(data.items);
        })
        .catch(error => {
            console.error('Error:', error);
            displayError('Failed to fetch related videos');
        });
}

function fetchRecommendedVideos(query) {
    fetch(`${searchApiEndpoint}?part=snippet&maxResults=8&q=${query}&type=video&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayRecommendedVideos(data.items);
        })
        .catch(error => {
            console.error('Error:', error);
            displayError('Failed to fetch recommended videos');
        });
}


function displayVideo(videoId, title) {
    const videoContainer = document.getElementById('video');
    const titleContainer = document.getElementById('video-title');
    videoContainer.innerHTML = `
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    `;
    titleContainer.textContent = title;
}

function displayRelatedVideos(videos) {
    const relatedVideosContainer = document.getElementById('related-videos');
    relatedVideosContainer.innerHTML = '<h2>Related Videos</h2>';
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video');
        videoElement.innerHTML = `
            <h3>${video.snippet.title}</h3>
            <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
            </a>
        `;
        relatedVideosContainer.appendChild(videoElement);
    });
}

function displayRecommendedVideos(videos) {
    const recommendedVideosContainer = document.getElementById('recommended-videos');
    recommendedVideosContainer.innerHTML = '<h2>Recommended Videos</h2>';
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video');
        videoElement.innerHTML = `
            <h3>${video.snippet.title}</h3>
            <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
            </a>
        `;
        recommendedVideosContainer.appendChild(videoElement);
    });
}

function displayError(message) {
    const errorContainer = document.getElementById('error');
    errorContainer.innerHTML = `<p>${message}</p>`;
    errorContainer.style.display = 'block';
}

// Placeholder function for sentiment analysis
async function analyzeSentiment(commentText) {
    return fetch(sentimentsApiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comments: [commentText] }) // Kirim komentar sebagai array
    })
    .then(response => response.json())
    .then(data => {
        if (data.sentiments && data.sentiments.length > 0) {
            return data.sentiments[0];
        } else {
            throw new Error('Sentiment analysis failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayError('Failed to analyze sentiment');
        return 'Error';
    });
}

function displayComment(author, commentText, sentiment) {
    const commentsContainer = document.getElementById('comments');
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.innerHTML = `
        <p><strong>${author}</strong>: ${commentText}</p>
        <p><strong>Sentiment:</strong> ${sentiment.label}</p>
        <p><strong>Score:</strong> ${sentiment.score}</p>
    `;
    commentsContainer.appendChild(commentElement);
}

function displayStatistics(sentiments) {
    const statisticsContainer = document.getElementById('statistics');
    statisticsContainer.innerHTML = '<h2>Sentiment Statistics</h2>';

    // Menghitung jumlah komentar positif, negatif, dan netral
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    sentiments.forEach(sentiment => {
        if (sentiment.label === 'positive') {
            positiveCount++;
        } else if (sentiment.label === 'negative') {
            negativeCount++;
        } else {
            neutralCount++;
        }
    });

    // Menampilkan statistik
    const totalComments = sentiments.length;
    const positivePercentage = (positiveCount / totalComments) * 100;
    const negativePercentage = (negativeCount / totalComments) * 100;
    const neutralPercentage = (neutralCount / totalComments) * 100;

    statisticsContainer.innerHTML += `
        <p>Total Comments: ${totalComments}</p>
        <p>Positive Comments: ${positiveCount} (${positivePercentage.toFixed(2)}%)</p>
        <p>Negative Comments: ${negativeCount} (${negativePercentage.toFixed(2)}%)</p>
        <p>Neutral Comments: ${neutralCount} (${neutralPercentage.toFixed(2)}%)</p>
    `;
}

