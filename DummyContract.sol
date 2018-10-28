pragma solidity 0.4.25;

contract DummyContract {
    event SendEmail(string to, string from, string subject, string body);
    event PostWhisper(string topic, string payload);
    
    function emitEventSendEmail(string _to, string _from, string _subject, string _body) public {
        emit SendEmail(_to, _from, _subject, _body);
    }
    
    function emitEventPostWhisper(string _topic, string _payload) public {
        emit PostWhisper(_topic, _payload);
    }
}