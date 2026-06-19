// CREADO POR: DANIEL INNOVA

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

import '../../../core/api/api_client.dart';
import '../models/usuario_model.dart'; // Importar el modelo de usuario

final authProvider = NotifierProvider<AuthNotifier, AuthState>(() {
  return AuthNotifier();
});

class AuthState {
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;
  final Usuario? user; // Añadir el usuario al estado

  AuthState({
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
    this.user, // Incluir en el constructor
  });

  // Es útil tener un método copyWith para actualizar el estado
  AuthState copyWith({
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
    Usuario? user,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      user: user ?? this.user,
    );
  }
}

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    _checkSession();
    return AuthState();
  }

  Future<void> _checkSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final userString = prefs.getString('user_data');

    if (token != null && userString != null) {
      try {
        final userData = jsonDecode(userString);
        final user = Usuario.fromJson(userData);
        state = AuthState(isAuthenticated: true, user: user);
      } catch (e) {
        // Si hay un error al decodificar, limpiar la sesión
        await prefs.remove('auth_token');
        await prefs.remove('user_data');
        state = AuthState();
      }
    } else {
      state = AuthState();
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await apiClient.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      final token = response.data['token'];
      final userData = response.data['usuario'];
      final user = Usuario.fromJson(userData);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', token);
      await prefs.setString('user_data', jsonEncode(userData)); // Guardar datos del usuario

      state = AuthState(isAuthenticated: true, user: user);
      return true;
    } catch (e) {
      state = AuthState(
        isAuthenticated: false,
        error: 'Credenciales inválidas o error de conexión.',
      );
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_data'); // Limpiar también los datos del usuario
    state = AuthState(); // Restablecer al estado inicial
  }
}