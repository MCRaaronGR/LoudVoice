document.getElementById('BtnFace').addEventListener('mouseover', function() {
    if (window.innerWidth > 800) {
        document.getElementById('imgS1').style.display = 'block';
    }
});

document.getElementById('BtnFace').addEventListener('mouseout', function() {
    document.getElementById('imgS1').style.display = 'none';
});

window.addEventListener('resize', function() {
    if (window.innerWidth <= 800) {
        document.getElementById('imgS1').style.display = 'none';
    }
});


document.getElementById('BtnSpot').addEventListener('mouseover', function() {
    if (window.innerWidth > 800) {
        document.getElementById('imgS4').style.display = 'block';
    }
});

document.getElementById('BtnSpot').addEventListener('mouseout', function() {
    document.getElementById('imgS4').style.display = 'none';
});

window.addEventListener('resize', function() {
    if (window.innerWidth <= 800) {
        document.getElementById('imgS4').style.display = 'none';
    }
});