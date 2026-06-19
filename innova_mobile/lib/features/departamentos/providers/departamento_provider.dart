import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/departamento_model.dart';
import '../repositories/departamento_repository.dart';
import '../../../../core/utils/logger_util.dart'; // Corrected Import the logger

final departamentoProvider = AutoDisposeAsyncNotifierProvider<DepartamentoNotifier, List<Departamento>>(
  DepartamentoNotifier.new,
);

class DepartamentoNotifier extends AutoDisposeAsyncNotifier<List<Departamento>> {
  final DepartamentoRepository _repository = DepartamentoRepository();

  @override
  Future<List<Departamento>> build() async {
    return _repository.getDepartamentos();
  }

  Future<bool> addDepartamento(Departamento departamento) async {
    state = const AsyncValue.loading();
    try {
      await _repository.createDepartamento(departamento);
      state = AsyncData(await _repository.getDepartamentos());
      return true;
    } catch (e, st) {
      logger.e("Error creating departamento: $e");
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  Future<bool> updateDepartamento(Departamento departamento) async {
    state = const AsyncValue.loading();
    try {
      await _repository.updateDepartamento(departamento);
      state = AsyncData(await _repository.getDepartamentos());
      return true;
    } catch (e, st) {
      logger.e("Error updating departamento: $e");
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  Future<bool> toggleEstado(int id, int estadoActual, String modificadoPor) async {
    state = const AsyncValue.loading();
    try {
      int nuevoEstado = estadoActual == 1 ? 0 : 1;
      await _repository.updateEstado(id, nuevoEstado, modificadoPor);
      state = AsyncData(await _repository.getDepartamentos());
      return true;
    } catch (e, st) {
      logger.e("Error toggling estado: $e");
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  Future<bool> deleteDepartamento(int id) async {
    state = const AsyncValue.loading();
    try {
      await _repository.deleteDepartamento(id);
      state = AsyncData(await _repository.getDepartamentos());
      return true;
    } catch (e, st) {
      logger.e("Error deleting departamento: $e");
      state = AsyncValue.error(e, st);
      return false;
    }
  }
}