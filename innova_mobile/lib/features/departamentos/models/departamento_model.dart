class Departamento {
  final int? id;
  final String nombre;
  final String? descripcion;
  final int? estado;
  final String? creadoPor;
  final String? fechaCreacion;
  final String? modificadoPor;
  final String? ultimaModificacion;

  Departamento({
    this.id,
    required this.nombre,
    this.descripcion,
    this.estado,
    this.creadoPor,
    this.fechaCreacion,
    this.modificadoPor,
    this.ultimaModificacion,
  });

  factory Departamento.fromJson(Map<String, dynamic> json) {
    return Departamento(
      id: json['id'],
      nombre: json['nombre'],
      descripcion: json['descripcion'],
      estado: json['estado'] is bool ? (json['estado'] ? 1 : 0) : json['estado'],
      creadoPor: json['creado_por'],
      fechaCreacion: json['fecha_creacion'],
      modificadoPor: json['modificado_por'],
      ultimaModificacion: json['ultima_modificacion'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'nombre': nombre,
      'descripcion': descripcion,
      'estado': estado,
      'creado_por': creadoPor,
      'modificado_por': modificadoPor,
    };
  }
}