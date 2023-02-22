const image = document.getElementById('output')
const fileButton = document.querySelector("#file")
const classifyButton = document.getElementById('classifyButton')
const section = document.getElementById('section')

fileButton.addEventListener("change", (event)=>{
    image.src = URL.createObjectURL(event.target.files[0])
})

let synth = window.speechSynthesis

function speak(text) {
    if (synth.speaking) {
        console.log('still speaking...')
        return
    }
    if (text !== '') {
        let utterThis = new SpeechSynthesisUtterance(text)
        synth.speak(utterThis)
        console.log(text);
    }
}

classifyButton.addEventListener("click", ()=>{
    speak(`I think it's ${results[0].label}`)
    startImageScan()
});

image.addEventListener('load', () => userImageUploaded())

function userImageUploaded(){
    console.log("The image is now visible in the DOM")
}

// Create a variable containing the result container
const element = document.getElementById("imageResult");

function startImageScan() {
    // Create a variable to initialize the ml5.js image classifier with MobileNet
    const classifier = ml5.imageClassifier('./model.json', './model.weights.bin');

    // Scan the uploaded image
    classifier.classify(document.getElementById("uploadedImage"), imageScanResult);
    element.innerHTML = "...";
}

// Check for errors and display the results if there aren't any
async function imageScanResult(error, results) {
    if (error) {
        element.innerHTML = error;
    } else {
        let num = await results[0].confidence * 100;
        element.innerHTML = results[0].label + "Confidence: " + num.toFixed(0) + "%";
    }
}