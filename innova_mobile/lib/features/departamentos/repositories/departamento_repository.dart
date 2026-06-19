import '../../../core/api/api_client.dart';
import '../models/departamento_model.dart';

class DepartamentoRepository {
  final ApiClient apiClient = ApiClient();

  Future<List<Departamento>> getDepartamentos() async {
    final response = await apiClient.dio.get('/departamentos/lista');
    return (response.data as List).map((json) => Departamento.fromJson(json)).toList();
  }

  Future<Departamento> createDepartamento(Departamento departamento) async {
    final response = await apiClient.dio.post('/departamentos/crear', data: departamento.toJson());
    // The backend returns { mensaje: "...", id: ... } for creation.
    // So we fetch again or just construct an optimistic model. 
    return Departamento(
      id: response.data['id'],
      nombre: departamento.nombre,
      descripcion: departamento.descripcion,
      estado: 1, // Default active
    );
  }
  
  Future<void> updateDepartamento(Departamento departamento) async {
    await apiClient.dio.put('/departamentos/editar/${departamento.id}', data: departamento.toJson());
  }

  Future<void> updateEstado(int id, int nuevoEstado, String modificadoPor) async {
    await apiClient.dio.put('/departamentos/estado/$id', data: {
      'estado': nuevoEstado,
      'modificado_por': modificadoPor
    });
  }

  Future<void> deleteDepartamento(int id) async {
    await apiClient.dio.delete('/departamentos/eliminar/$id');
  }
}