<template>
  <div class="min-h-screen bg-slate-50 flex font-sans justify-center p-8">
    
    <main class="w-full max-w-5xl bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
      <header class="mb-10 flex justify-between items-center border-b border-slate-100 pb-6">
        <div>
          <h1 class="text-3xl font-black text-slate-800 tracking-tight uppercase">Nuevo Empleado</h1>
          <p class="text-slate-500 mt-1 font-medium italic">Complete la ficha de información del colaborador.</p>
        </div>
        <button @click="cerrarVentana" class="text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition flex items-center gap-2 bg-slate-50 p-3 rounded-xl hover:bg-red-50">
          <span>❌</span> Cancelar y Cerrar
        </button>
      </header>

      <form @submit.prevent="guardarEmpleado" class="space-y-8">
        
        <div>
          <h2 class="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-6 border-b pb-2">1. Información Personal</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="field in camposPersonales" :key="field.id">
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">{{ field.label }}</label>
              <input v-model="form[field.id]" :type="field.type" :placeholder="field.placeholder" required
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all">
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Género</label>
              <select v-model="form.genero" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:border-blue-500 transition-all">
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
            <div class="md:col-span-3">
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Dirección Exacta</label>
              <textarea v-model="form.direccion" rows="2" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"></textarea>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-6 border-b pb-2">2. Información Laboral</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Tipo de Contrato</label>
              <select v-model="form.tipo_contrato" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:border-blue-500 transition-all">
                <option value="Permanente">Permanente</option>
                <option value="Temporal">Temporal</option>
                <option value="Servicios Profesionales">Servicios Profesionales</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Departamento</label>
              <select v-model="form.departamento_id" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:border-blue-500 transition-all">
                <option value="">Seleccione</option>
                <option v-for="dep in departamentos" :key="dep.id" :value="dep.id">
                  {{ dep.nombre }}
                </option>
              </select>
            </div>
            <div v-for="field in camposLaborales" :key="field.id">
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">{{ field.label }}</label>
              <input v-model="form[field.id]" :type="field.type" required
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all">
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-6 border-b pb-2">3. Contacto de Emergencia 1</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="field in camposEmergencia" :key="field.id">
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">{{ field.label }}</label>
              <select v-if="field.type === 'select'" v-model="form[field.id]" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all">
                <option value="" disabled>Seleccione...</option>
                <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
              </select>
              <input v-else v-model="form[field.id]" :type="field.type" :placeholder="field.placeholder" required
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all">
            </div>
          </div>
        </div>

        <div class="mt-8">
          <h2 class="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-6 border-b pb-2">4. Contacto de Emergencia 2 (Opcional)</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="field in camposEmergencia2" :key="field.id">
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">{{ field.label }}</label>
              <select v-if="field.type === 'select'" v-model="form[field.id]" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all">
                <option value="" disabled>Seleccione...</option>
                <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
              </select>
              <input v-else v-model="form[field.id]" :type="field.type" :placeholder="field.placeholder"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all">
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-10 border-t border-slate-100 pt-8">
          <button type="submit" :disabled="loading"
            class="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:bg-slate-300">
            {{ loading ? 'Guardando...' : 'Guardar y Cerrar' }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import axios from 'axios'

const loading = ref(false)
const departamentos = ref([])

const form = ref({
  codigo_empleado: '', identidad: '', nombre: '', apellido: '', fecha_nacimiento: '', genero: 'Masculino',
  correo: '', telefono: '', direccion: '',
  tipo_contrato: 'Permanente', fecha_inicio: '', ciudad: '', ubicacion: '', departamento_id: '',
  emergencia_parentesco: '', emergencia_nombre: '', emergencia_telefono: '',
  emergencia_parentesco_2: '', emergencia_nombre_2: '', emergencia_telefono_2: ''
})

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3007/api/departamentos/lista')
    departamentos.value = res.data
  } catch (error) {
    console.error("Error al cargar departamentos", error)
  }
})

const camposPersonales = [
  { id: 'codigo_empleado', label: 'Código Empleado', type: 'text', placeholder: 'Ej: EMP-001' },
  { id: 'identidad', label: 'Identidad', type: 'text', placeholder: '0000-0000-00000' },
  { id: 'nombre', label: 'Nombres', type: 'text', placeholder: 'Ej: Juan Alberto' },
  { id: 'apellido', label: 'Apellidos', type: 'text', placeholder: 'Ej: Perez Flores' },
  { id: 'fecha_nacimiento', label: 'F. Nacimiento', type: 'date' },
  { id: 'correo', label: 'Correo Personal', type: 'email', placeholder: 'empleado@correo.com' },
  { id: 'telefono', label: 'Teléfono', type: 'text', placeholder: '+504 0000-0000' }
]

const camposLaborales = [
  { id: 'fecha_inicio', label: 'Fecha de Inicio', type: 'date' },
  { id: 'ciudad', label: 'Ciudad', type: 'text' },
  { id: 'ubicacion', label: 'Ubicación / Piso', type: 'text' }
]

const camposEmergencia = [
  { id: 'emergencia_parentesco', label: 'Parentesco', type: 'select', options: ['Padre', 'Madre', 'Conyuge', 'Hermano(a)', 'Tio(a)', 'Otro (a)'] },
  { id: 'emergencia_nombre', label: 'Nombre Completo', type: 'text' },
  { id: 'emergencia_telefono', label: 'Teléfono Emergencia', type: 'text' }
]

const camposEmergencia2 = [
  { id: 'emergencia_parentesco_2', label: 'Parentesco', type: 'select', options: ['Padre', 'Madre', 'Conyuge', 'Hermano(a)', 'Tio(a)', 'Otro (a)'] },
  { id: 'emergencia_nombre_2', label: 'Nombre Completo', type: 'text' },
  { id: 'emergencia_telefono_2', label: 'Teléfono Emergencia', type: 'text' }
]

// Función para cerrar la pestaña
const cerrarVentana = () => {
  navigateTo('/empleados')
}

const guardarEmpleado = async () => {
  try {
    loading.value = true
    const res = await axios.post('http://localhost:3007/api/empleados/crear', form.value)
    
    alert('✅ ' + res.data.mensaje)
    
    // Regresa a la lista de empleados al guardar exitosamente
    navigateTo('/empleados')
    
  } catch (e) {
    alert('❌ ' + (e.response?.data?.mensaje || 'Error al guardar'))
  } finally {
    loading.value = false
  }
}
</script>