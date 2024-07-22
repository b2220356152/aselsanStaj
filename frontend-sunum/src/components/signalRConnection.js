import * as signalR from '@microsoft/signalr';

class SignalRConnection {
  constructor() {
    if (!SignalRConnection.instance) {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7045/myhub")
        .build();
      SignalRConnection.instance = this;
    }

    return SignalRConnection.instance;
  }

  async start() {
    try {
      await this.connection.start();
      console.log('Connected to myHub');
    } catch (error) {
      console.error('Connection failed: ', error);
    }
  }

  getConnection() {
    return this.connection;
  }
}

const instance = new SignalRConnection();
Object.freeze(instance);

export default instance;
