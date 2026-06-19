import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;

  SocketService._internal() {
    // TODO: La IP debe ser la de tu servidor backend.
    // Si usas un emulador de Android, usa 10.0.2.2 para referirte al localhost de tu máquina.
    // Si usas un dispositivo físico, asegúrate de que esté en la misma red y usa la IP de tu máquina.
    _socket = IO.io('http://10.0.2.2:3007', <String, dynamic>{ 
      'transports': ['websocket'],
      'autoConnect': false,
    });
    _socket.connect();

    _socket.onConnect((_) {
      print('✅ Socket.IO: Conectado al servidor');
    });

    _socket.onDisconnect((_) {
      print('❌ Socket.IO: Desconectado del servidor');
    });

    _socket.onConnectError((data) {
      print('❌ Socket.IO: Error de conexión: $data');
    });

    _socket.onError((data) {
      print('❌ Socket.IO: Error general: $data');
    });
  }

  late IO.Socket _socket;

  IO.Socket get socket => _socket;
}
