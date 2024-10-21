const youtubeTranscript = require('youtube-transcript-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");


async function fetchYouTubeTranscript(videoUrl) {
    try {
        let videoId;

        
        if (videoUrl.includes('youtu.be')) {
            videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
        } else if (videoUrl.includes('youtube.com')) {
            videoId = videoUrl.split('v=')[1].split('&')[0];
        } else {
            throw new Error('Invalid YouTube URL format');
        }

        
        const transcriptData = await youtubeTranscript.getTranscript(videoId);
        

        
        const paragraphs = combineTranscriptIntoParagraphs(transcriptData);
        
        
        const genAI = new GoogleGenerativeAI('AIzaSyC5lijzxdag0jtWlNib0ZlIrU6lixcH4zU');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `generate suitable image of given paragraph${paragraphs.join(' ')}`;

        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    } catch (error) {
        console.error('Error fetching transcript:', error);
    }
}


function combineTranscriptIntoParagraphs(transcriptData, maxCharsPerParagraph = 500) {
    let paragraphs = [];
    let currentParagraph = "";

    transcriptData.forEach((entry) => {
        
        currentParagraph += ` ${entry.text}`;

        
        if (currentParagraph.length > maxCharsPerParagraph) {
            paragraphs.push(currentParagraph.trim()); 
            currentParagraph = ""; 
        }
    });

    if (currentParagraph.trim().length > 0) {
        paragraphs.push(currentParagraph.trim());
    }

    return paragraphs;
}




const videoUrl = 'https://youtu.be/FSRo41TaHFU?si=eC6ACxt2a_SmHuca';  
fetchYouTubeTranscript(videoUrl);


