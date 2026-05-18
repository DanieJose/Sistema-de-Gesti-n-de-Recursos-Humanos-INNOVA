<template>
  <div class="p-8 font-sans bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button @click="navigateTo('/')" class="p-3 bg-white text-slate-600 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center group" title="Regresar al Inicio">
          <span class="text-xl group-hover:-translate-x-1 transition-transform">🔙</span>
        </button>
        <div class="flex-1">
          <h1 class="text-3xl font-black text-slate-800 tracking-tight">Gestión de Manuales</h1>
          <p class="text-slate-500 mt-1">Sube y administra los manuales de la Biblioteca Digital.</p>
        </div>
        <button @click="abrirModal" class="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center gap-2">
          <span>➕</span> Subir Manual
        </button>
      </div>

      <!-- Tabla de Manuales -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 class="text-lg font-bold text-slate-700">Manuales Publicados</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-semibold">ID</th>
                <th class="p-4 font-semibold">Título</th>
                <th class="p-4 font-semibold">Categoría</th>
                <th class="p-4 font-semibold">Tamaño</th>
                <th class="p-4 font-semibold">Creado Por</th>
                <th class="p-4 font-semibold">Fecha Creación</th>
                <th class="p-4 font-semibold">Modificado Por</th>
                <th class="p-4 font-semibold">Fecha Modificación</th>
                <th class="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="cargando">
                <td colspan="9" class="p-8 text-center text-slate-500 italic">Cargando manuales...</td>
              </tr>
              <tr v-else-if="manuales.length === 0">
                <td colspan="9" class="p-8 text-center text-slate-500 italic">No hay manuales registrados.</td>
              </tr>
              <tr v-for="manual in manuales" :key="manual.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="p-4 text-sm text-slate-600 font-medium">#{{ manual.id }}</td>
                <td class="p-4">
                  <div class="text-sm font-bold text-slate-800">{{ manual.titulo }}</div>
                  <div class="text-xs text-slate-500 truncate max-w-xs">{{ manual.descripcion }}</div>
                </td>
                <td class="p-4">
                  <span class="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase rounded-md tracking-wider">
                    {{ manual.categoria || 'General' }}
                  </span>
                </td>
                <td class="p-4 text-sm text-slate-600">{{ manual.tamano || 'N/A' }}</td>
                <td class="p-4 text-sm text-slate-600">{{ manual.creadoPorNombre || 'Desconocido' }}</td>
                <td class="p-4 text-sm text-slate-600">{{ new Date(manual.fechaCreacion).toLocaleDateString() }}</td>
                <td class="p-4 text-sm text-slate-600">{{ manual.modificadoPorNombre || 'N/A' }}</td>
                <td class="p-4 text-sm text-slate-600">{{ manual.fechaModificacion ? new Date(manual.fechaModificacion).toLocaleDateString() : 'N/A' }}</td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="abrirModalEditar(manual)" class="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Editar">
                      ✏️
                    </button>
                    <button @click="eliminarManual(manual.id)" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Subir/Editar Manual -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <h2 class="text-2xl font-black text-slate-800 mb-6">{{ editandoId ? 'Editar Manual' : 'Subir Nuevo Manual' }}</h2>
        
        <form @submit.prevent="subirManual" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Título</label>
            <input v-model="form.titulo" type="text" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors">
          </div>
          
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Categoría</label>
            <input v-model="form.categoria" type="text" placeholder="Ej: Legal, Sistemas, RRHH" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors">
          </div>
          
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
            <textarea v-model="form.descripcion" rows="3" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Archivo PDF</label>
            <input type="file" ref="archivoInput" accept=".pdf" :required="!editandoId" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
            <p v-if="editandoId" class="text-xs text-slate-500 mt-1">Opcional. Sube un archivo solo si deseas reemplazar el actual.</p>
          </div>

          <div class="flex gap-3 mt-8">
            <button type="button" @click="cerrarModal" class="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="subiendo" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50">
              {{ subiendo ? 'Guardando...' : 'Guardar Manual' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const manuales = ref([])
const cargando = ref(true)
const mostrarModal = ref(false)
const subiendo = ref(false)
const archivoInput = ref(null)
const editandoId = ref(null)

const form = ref({
  titulo: '',
  categoria: '',
  descripcion: ''
})

const cargarManuales = async () => {
  cargando.value = true
  try {
    const res = await fetch(`${config.public.apiBase}/api/biblioteca`)
    if (res.ok) {
      manuales.value = await res.json()
    }
  } catch (error) {
    console.error('Error cargando manuales:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarManuales()
})

const abrirModal = () => {
  editandoId.value = null
  form.value = { titulo: '', categoria: '', descripcion: '' }
  if (archivoInput.value) archivoInput.value.value = ''
  mostrarModal.value = true
}

const abrirModalEditar = (manual) => {
  editandoId.value = manual.id
  form.value = {
    titulo: manual.titulo,
    categoria: manual.categoria,
    descripcion: manual.descripcion
  }
  if (archivoInput.value) archivoInput.value.value = ''
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const subirManual = async () => {
  const file = archivoInput.value.files[0]
  if (!editandoId.value && !file) return alert('Por favor selecciona un archivo PDF')

  subiendo.value = true
  
  const userId = localStorage.getItem('usuarioID') || 1

  const formData = new FormData()
  formData.append('titulo', form.value.titulo)
  formData.append('categoria', form.value.categoria)
  formData.append('descripcion', form.value.descripcion)
  
  if (editandoId.value) {
    formData.append('modificadoPor', userId)
  } else {
    formData.append('creadoPor', userId)
  }

  if (file) {
    formData.append('archivo', file)
  }

  const url = editandoId.value 
    ? `${config.public.apiBase}/api/biblioteca/${editandoId.value}` 
    : `${config.public.apiBase}/api/biblioteca/subir`
    
  const method = editandoId.value ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, {
      method: method,
      body: formData
    })
    
    if (res.ok) {
      alert(editandoId.value ? 'Manual actualizado con éxito' : 'Manual subido con éxito')
      cerrarModal()
      cargarManuales() // Recargar lista
    } else {
      const errorData = await res.json()
      alert(`Error al guardar manual: ${errorData.error}`)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error de conexión al guardar el manual')
  } finally {
    subiendo.value = false
  }
}

const eliminarManual = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este manual? Esta acción no se puede deshacer.')) return

  try {
    const res = await fetch(`${config.public.apiBase}/api/biblioteca/${id}`, {
      method: 'DELETE'
    })
    
    if (res.ok) {
      manuales.value = manuales.value.filter(m => m.id !== id)
      alert('Manual eliminado con éxito')
    } else {
      alert('Error al eliminar manual')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error de conexión')
  }
}
</script>