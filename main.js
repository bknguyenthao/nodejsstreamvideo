const socket = io('http://localhost:3000/');

$("#div-chat").hide();

socket.on("DANH_SACH_ONLINE", arrUser => {
    $("#div-chat").show();
    $("#div-register").hide();

    arrUser.forEach(user => {
        $("#ulUser").append(`<li id ="${user.peerId}"> ${user.username} </li>`);
    })

    socket.on("CO_NGUOI_DUNG_MOI", user => {
        $("#ulUser").append(`<li id ="${user.peerId}"> ${user.username} </li>`);
    })
})

socket.on("DANG_KY_THAT_BAI", () => {
    alert("Username is exist");
})

socket.on("AI_DO_NGAT_KET_NOI", peerId => {
    $(`#${peerId}`).remove();
})

function openStream() {
    let config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    let video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// Open peer
let peer = new Peer({ key: 'o0ctupl25xtxd2t9' });
peer.on("open", id => {
    // Handle button register click
    $(btnSign).click(() => {
        let name = $(txtUser).val();
        socket.emit("NGUOI_DUNG_DANG_KY", { username: name, peerId: id });
    })
})

// Answer
peer.on("call", call => {
    openStream().then(stream => {
        call.answer(stream);
        playStream("localStream", stream);
        call.on("stream", remoteStream => playStream("remoteStream", remoteStream));
    })
})

// Caller
$("#ulUser").on("click", "li", function() {
    let peerId = $(this).attr("id");
    openStream().then(stream => {
        playStream("localStream", stream);
        let call = peer.call(peerId, stream);
        call.on("stream", remoteStream => playStream("remoteStream", remoteStream));
    })
})