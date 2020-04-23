export class ChatMessage {
    senderUid: string;
    receiverUid: string;
    message: string;
    timeSent: Date;
    sendSelf: boolean;
}