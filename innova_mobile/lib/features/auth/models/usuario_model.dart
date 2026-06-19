class Usuario {
  final int id;
  final String nombre;
  final String email;

  Usuario({
    required this.id,
    required this.nombre,
    required this.email,
  });

  factory Usuario.fromJson(Map<String, dynamic> json) {
    return Usuario(
      id: json['id'] ?? 0,
      nombre: json['nombre'] ?? '',
      email: json['email'] ?? '',
    );
  }

  // Si se necesita un mapa para enviar a una API, por ejemplo
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nombre': nombre,
      'email': email,
    };
  }
}
