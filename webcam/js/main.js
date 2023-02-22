const video = document.getElementById("webcam");
const label = document.getElementById("label");

const labelOneBtn = document.querySelector("#labelOne");
const labelTwoBtn = document.querySelector("#labelTwo");
const trainbtn = document.querySelector("#train");
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.log("Something went wrong!");
        });
}

label.innerText = "Ready when you are!";

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');

  labelOneBtn.addEventListener("click", (event) => learnPicture(event));
  labelTwoBtn.addEventListener("click", (event) => saveModel(event));
  trainbtn.addEventListener("click", (event) => train(event));
}

// Create a new classifier using those features and with a video element
const classifier = featureExtractor.classification(video, videoReady);

// Triggers when the video is ready
function videoReady() {
  console.log('The video is ready!');
}

// Add a new image with a label
function learnPicture(e) {
    e.preventDefault()
    const object = document.getElementById('object').value;
    console.log(object);
    classifier.addImage(video, object);
}

let loaded = false

// Retrain the network
function train(e) {
    e.preventDefault()
    classifier.train((lossValue) => {
        console.log('Loss is', lossValue);
        loaded = true
  });
}

setInterval( () => {
    if (loaded) {
        classifier.classify(video, (err, result) => {
            console.log(result);
        })
    }
}, 1000);

// SaveModel function
function saveModel(e){
    e.preventDefault();
    featureExtractor.save();
}

// Speak function
let synth = window.speechSynthesis

function speak(text) {
    if (synth.speaking) {
        console.log('still speaking...')
        return
    }
    if (text !== '') {
        console.log(text);
        let utterThis = new SpeechSynthesisUtterance(text)
        synth.speak(utterThis)
    }
}

speak("Hello world")
