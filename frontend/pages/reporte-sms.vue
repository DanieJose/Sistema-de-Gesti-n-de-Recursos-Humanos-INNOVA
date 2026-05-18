<template>
  <div class="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
    
    <!-- Botón de regreso -->
    <div class="mb-8">
      <button @click="goBack" class="text-sm text-gray-500 hover:text-blue-600 font-medium flex items-center transition-colors">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver
      </button>
    </div>

    <!-- Header & Buscador -->
    <div class="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8 text-center">
      <h1 class="text-3xl font-black text-slate-800 tracking-tight uppercase mb-2">Seguimiento de Ticket</h1>
      <p class="text-slate-500 text-sm font-medium italic mb-8">Consulta el estado y la conversación de tu solicitud.</p>
      
      <form @submit.prevent="buscarTicket" class="max-w-md mx-auto flex gap-3">
        <input 
          v-model="searchId" 
          type="text" 
          placeholder="Ej: TKT-018 o 18" 
          class="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 text-center font-bold tracking-widest uppercase"
          required
        />
        <button type="submit" :disabled="loading" class="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50">
          {{ loading ? 'Buscando...' : 'Buscar' }}
        </button>
      </form>

      <div v-if="errorMsg" class="mt-4 text-red-500 text-sm font-bold">
        {{ errorMsg }}
      </div>
    </div>

    <!-- Resultados del Ticket -->
    <div v-if="ticket" class="space-y-6">
      
      <!-- Info del Ticket -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div class="flex flex-wrap justify-between items-center border-b border-gray-100 pb-4 mb-4">
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-bold text-gray-800">{{ ticket.displayId }}</h2>
            <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', estadoClass(ticket.estado)]">
              {{ ticket.estado }}
            </span>
          </div>
          <div class="text-sm text-gray-500 font-medium mt-2 md:mt-0">
            Creado el: {{ ticket.fechaFormateada }}
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ ticket.tema || ticket.tipo }}</h3>
          <p class="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">{{ ticket.descripcion }}</p>
        </div>

        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Categoría</span>
            <span class="font-bold text-gray-800">{{ ticket.tipo }}</span>
          </div>
          <div>
            <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prioridad</span>
            <span class="font-bold text-gray-800">{{ ticket.prioridad }}</span>
          </div>
          <div>
            <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Solicitante</span>
            <span class="font-bold text-gray-800">{{ ticket.creadorNombre }}</span>
          </div>
          <div>
            <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asignado a</span>
            <span class="font-bold text-gray-800">{{ ticket.asignadoNombre }}</span>
          </div>
        </div>
      </div>

      <!-- Conversación / Respuestas -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 class="font-black text-slate-800 uppercase tracking-tight">Conversación y Seguimiento</h3>
          <span class="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">{{ respuestas.length }} mensajes</span>
        </div>
        
        <div class="p-6 space-y-6">
          <div v-if="respuestas.length === 0" class="text-center py-10 text-slate-400 italic font-medium">
            Aún no hay respuestas o actualizaciones en este ticket.
          </div>

          <div v-for="res in respuestas" :key="res.id" class="flex gap-4">
            <div class="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center">
              <img v-if="res.avatar" :src="res.avatar" class="w-full h-full object-cover" />
              <span v-else class="text-slate-500 font-bold">{{ res.nombre.charAt(0) }}</span>
            </div>
            
            <div class="flex-1 bg-slate-50 rounded-2xl rounded-tl-none p-4 border border-slate-100">
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-sm font-bold text-slate-900">{{ res.nombre }}</h4>
                <span class="text-xs text-slate-400 font-medium">{{ res.fecha }}</span>
              </div>
              <p class="text-sm text-slate-700 whitespace-pre-line">{{ res.mensaje }}</p>
              
              <div v-if="res.archivo" class="mt-3 inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2 text-xs hover:border-blue-300 transition-colors">
                <span>📎</span>
                <a :href="res.archivo" target="_blank" class="text-blue-600 font-bold hover:underline truncate max-w-[200px]">{{ res.archivo_nombre }}</a>
              </div>
            </div>
          </div>

          <!-- Formulario Nueva Respuesta -->
          <div class="pt-6 border-t border-slate-100 mt-6">
            <h4 class="text-sm font-black text-slate-800 uppercase tracking-tight mb-4">Añadir una respuesta</h4>
            <form @submit.prevent="enviarRespuesta" class="space-y-4">
              <textarea v-model="nuevaRespuesta.mensaje" rows="3" class="w-full p-4 border border-slate-200 bg-slate-50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm text-slate-700 transition-all" placeholder="Escribe tu respuesta aquí..." required></textarea>
              
              <div class="flex items-center justify-between">
                <div class="relative overflow-hidden cursor-pointer">
                  <input type="file" ref="archivoRespuesta" @change="manejarArchivo" class="absolute inset-0 opacity-0 cursor-pointer" />
                  <button type="button" class="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-sm">
                    <span>📎</span> {{ archivoSeleccionado ? archivoSeleccionado.name : 'Adjuntar Archivo' }}
                  </button>
                </div>
                
                <button type="submit" :disabled="enviandoRespuesta || ticket.estado === 'Cerrado'" class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-sm tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:bg-slate-400">
                  {{ enviandoRespuesta ? 'Enviando...' : 'Enviar Respuesta' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const searchId = ref('')
const loading = ref(false)
const errorMsg = ref('')
const ticket = ref(null)
const respuestas = ref([])

// Formulario de respuesta
const nuevaRespuesta = ref({ mensaje: '' })
const enviandoRespuesta = ref(false)
const archivoSeleccionado = ref(null)
const archivoRespuesta = ref(null)

const goBack = () => {
  router.push('/login') // O regresar a donde considere necesario el usuario externo
}

const manejarArchivo = (e) => {
  archivoSeleccionado.value = e.target.files[0]
}

const enviarRespuesta = async () => {
  if (!ticket.value) return;
  if (!nuevaRespuesta.value.mensaje.trim()) {
    return alert("El mensaje no puede estar vacío");
  }
  
  enviandoRespuesta.value = true;
  const formData = new FormData();
  formData.append('mensaje', nuevaRespuesta.value.mensaje);
  
  // Tratar de obtener el ID del usuario / empleado si está logueado, sino será externo
  const usuarioID = localStorage.getItem('usuarioID');
  if (usuarioID) formData.append('usuario_id', usuarioID);
  
  if (ticket.value.empleado_id) {
    // Si sabemos qué empleado creó el ticket, y es el mismo (como empleado)
    formData.append('empleado_id', ticket.value.empleado_id);
  }
  
  if (archivoSeleccionado.value) {
    formData.append('archivo', archivoSeleccionado.value);
  }
  
  try {
    await axios.post(`http://localhost:3000/api/tickets/${ticket.value.rawId || ticket.value.id}/respuestas`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    nuevaRespuesta.value.mensaje = '';
    archivoSeleccionado.value = null;
    if (archivoRespuesta.value) archivoRespuesta.value.value = '';
    
    // Recargar el ticket para ver la nueva respuesta
    await buscarTicketPorId(ticket.value.rawId || ticket.value.id);
  } catch (error) {
    console.error("Error al enviar respuesta:", error);
    alert("Hubo un error al enviar tu respuesta.");
  } finally {
    enviandoRespuesta.value = false;
  }
}

const buscarTicketPorId = async (numericId) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/tickets/${numericId}`)
    const data = res.data

    let asignado = 'Sin asignar'
    if (data.asignado_empleado_nombre) asignado = `${data.asignado_empleado_nombre} ${data.asignado_empleado_apellido || ''}`.trim()
    else if (data.asignado_usuario_nombre) asignado = data.asignado_usuario_nombre
    
    let creador = 'Externo/Desconocido'
    if (data.empleado_nombre) creador = `${data.empleado_nombre} ${data.empleado_apellido || ''}`.trim()

    ticket.value = {
      ...data,
      displayId: `#TKT-${String(data.id).padStart(3, '0')}`,
      rawId: data.id,
      creadorNombre: creador,
      asignadoNombre: asignado,
      fechaFormateada: new Date(data.fecha_creacion).toLocaleDateString('es-HN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    }

    const resR = await axios.get(`http://localhost:3000/api/tickets/${numericId}/respuestas`)
    respuestas.value = resR.data.map(r => ({
      id: r.id,
      mensaje: r.mensaje,
      fecha: new Date(r.fecha_creacion).toLocaleDateString('es-HN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      archivo: r.archivo ? `http://localhost:3000${r.archivo}` : null,
      archivo_nombre: r.archivo ? r.archivo.split('/').pop() : null,
      nombre: r.empleado_nombre ? `${r.empleado_nombre} ${r.empleado_apellido || ''}` : r.usuario_nombre || 'Usuario',
      avatar: r.empleado_foto ? `http://localhost:3000${r.empleado_foto}` : (r.usuario_foto ? `http://localhost:3000${r.usuario_foto}` : null)
    }))
  } catch (err) {
    throw err;
  }
}

const buscarTicket = async () => {
  errorMsg.value = ''
  ticket.value = null
  respuestas.value = []
  
  if (!searchId.value.trim()) return;

  const match = searchId.value.match(/\d+/)
  if (!match) {
    errorMsg.value = 'Formato de ticket inválido. Intenta con un número (ej. 18)'
    return
  }
  
  const numericId = parseInt(match[0], 10)
  
  try {
    loading.value = true
    await buscarTicketPorId(numericId)
  } catch (err) {
    if (err.response && err.response.status === 404) {
      errorMsg.value = 'Ticket no encontrado. Verifica el número.'
    } else {
      errorMsg.value = 'Error de conexión con el servidor.'
    }
  } finally {
    loading.value = false
  }
}

const estadoClass = (e) => {
  const est = (e || 'Pendiente').toLowerCase()
  if (est === 'resuelto' || est === 'cerrado') return 'bg-green-100 text-green-700 border border-green-200'
  if (est === 'abierto') return 'bg-blue-100 text-blue-700 border border-blue-200'
  if (est === 'en progreso') return 'bg-purple-100 text-purple-700 border border-purple-200'
  return 'bg-slate-100 text-slate-700 border border-slate-200'
}
</script>