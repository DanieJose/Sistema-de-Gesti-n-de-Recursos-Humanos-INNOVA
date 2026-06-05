<template>
  <div class="min-h-screen bg-gray-100 flex font-sans overflow-x-hidden">
    <!-- SIDEBAR -->
    <aside class="w-64 bg-slate-800 text-white flex flex-col shadow-xl fixed h-full z-10 hidden md:flex">
      <div class="p-6 text-2xl font-bold border-b border-slate-700 tracking-tight text-blue-400 uppercase">
        RRHH Innova
      </div>
      
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <div v-for="(item, index) in menuUsuario" :key="item.ruta || index">
          <div v-if="item.esCabecera" class="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-6 mb-2 px-3">
            {{ item.nombre }}
          </div>
          <NuxtLink v-else :to="item.ruta" 
            class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700 transition-all duration-200 group"
            active-class="bg-blue-600 shadow-lg">
            <span class="text-xl group-hover:scale-110 transition-transform">{{ item.icono }}</span>
            <span class="text-sm font-medium">{{ item.nombre }}</span>
          </NuxtLink>
        </div>
      </nav>

      <div class="p-4 border-t border-slate-700 bg-slate-900/50">
        <div class="mb-4 px-2 flex flex-col">
          <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nivel de Acceso</span>
          <span class="text-xs font-bold text-blue-400">{{ rolNombre }}</span>
        </div>
        <button @click="logout" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-xs uppercase tracking-widest">
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- MOBILE MENU BUTTON -->
    <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden fixed top-4 right-4 z-50 p-3 bg-slate-800 text-white rounded-lg shadow-lg flex items-center justify-center">
      <span class="text-xl">{{ mobileMenuOpen ? '✖' : '☰' }}</span>
    </button>

    <!-- MOBILE SIDEBAR -->
    <div v-if="mobileMenuOpen" class="fixed inset-0 bg-slate-800 z-40 md:hidden flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-slate-700 tracking-tight text-blue-400 uppercase">
        RRHH Innova
      </div>
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <div v-for="(item, index) in menuUsuario" :key="item.ruta || index">
          <div v-if="item.esCabecera" class="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-6 mb-2 px-3">
            {{ item.nombre }}
          </div>
          <NuxtLink v-else :to="item.ruta" @click="mobileMenuOpen = false"
            class="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-700 transition-all duration-200"
            active-class="bg-blue-600 shadow-lg">
            <span class="text-xl">{{ item.icono }}</span>
            <span class="text-sm font-bold">{{ item.nombre }}</span>
          </NuxtLink>
        </div>
      </nav>
      <div class="p-6 border-t border-slate-700 bg-slate-900/50">
         <button @click="logout" class="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-red-500/20 text-red-400 font-bold text-sm uppercase tracking-widest">
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <main class="flex-1 md:ml-64 p-4 md:p-6 w-full transition-all printable-area">
      <!-- HEADER -->
      <header class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight uppercase">Módulo de Reportes</h1>
          <p class="text-slate-500 mt-1 font-medium text-sm">Dashboard Analítico y Reportes Detallados</p>
        </div>
        <div class="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
          <button @click="imprimirReporte" class="w-full md:w-auto bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold uppercase text-xs hover:bg-slate-900 transition-all shadow-sm flex items-center justify-center gap-2 no-print">
            <span>🖨️</span> Exportar a PDF
          </button>
          
          <div class="relative w-full md:w-auto flex justify-end">
            <div @click="dropdownPerfilAbierto = !dropdownPerfilAbierto" class="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors no-print">
              <div v-if="fotoUsuario" class="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-slate-100">
                <img :src="`http://localhost:3007${fotoUsuario}`" class="w-full h-full object-cover" />
              </div>
              <div v-else class="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-black text-lg ring-2 ring-slate-100 uppercase">
                {{ usuarioActual ? usuarioActual.charAt(0) : 'U' }}
              </div>
              <div class="flex flex-col text-left">
                <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">Usuario Activo</span>
                <span class="text-base font-black text-slate-900 leading-tight">{{ usuarioActual || 'Cargando...' }}</span>
              </div>
            </div>

            <!-- Dropdown Menu -->
            <div v-if="dropdownPerfilAbierto" class="absolute right-0 mt-14 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200 no-print">
              <div class="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                <div v-if="fotoUsuario" class="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm shrink-0">
                  <img :src="`http://localhost:3007${fotoUsuario}`" class="w-full h-full object-cover" />
                </div>
                <div v-else class="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-black text-xl ring-2 ring-white shadow-sm shrink-0 uppercase">
                  {{ usuarioActual ? usuarioActual.charAt(0) : 'U' }}
                </div>
                <div>
                  <p class="font-black text-slate-800 text-sm leading-tight">{{ usuarioActual || 'Cargando...' }}</p>
                  <p class="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">{{ rolNombre || 'Cargando...' }}</p>
                </div>
              </div>
              <div class="p-2 space-y-1">
                <button @click="abrirModalPerfil(); dropdownPerfilAbierto = false" class="w-full text-left flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                  <span class="text-lg group-hover:scale-110 transition-transform">👤</span>
                  <span class="text-sm font-bold text-slate-700">Mi Perfil de Usuario</span>
                </button>
                <button @click="logout" class="w-full text-left flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors group">
                  <span class="text-lg group-hover:scale-110 transition-transform">🚪</span>
                  <span class="text-sm font-bold text-red-600">Cerrar Sesión</span>
                </button>
              </div>
            </div>
            <!-- Overlay invisible para cerrar el dropdown si se hace click fuera -->
            <div v-if="dropdownPerfilAbierto" @click="dropdownPerfilAbierto = false" class="fixed inset-0 z-40"></div>
          </div>
        </div>
      </header>

      <!-- NAVIGATION TABS -->
      <div class="flex border-b border-slate-200 mb-6 overflow-x-auto no-print">
        <button @click="activeTab = 'dashboard'" :class="['px-6 py-3 font-bold text-xs uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors', activeTab === 'dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300']">
          📊 Dashboard General
        </button>
        <button @click="activeTab = 'empleados'" :class="['px-6 py-3 font-bold text-xs uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors', activeTab === 'empleados' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300']">
          👥 Plantilla & Empleados
        </button>
        <button @click="activeTab = 'tickets'" :class="['px-6 py-3 font-bold text-xs uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors', activeTab === 'tickets' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300']">
          🎫 Soporte & Tickets
        </button>
      </div>

      <!-- TAB: DASHBOARD -->
      <div v-if="activeTab === 'dashboard'">
        <!-- KPIs -->
        <div v-if="loadingStats" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center text-slate-400 text-sm italic">
          Cargando indicadores...
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center gap-1 border-l-4 border-l-blue-500">
            <div class="flex items-center justify-between">
              <span class="text-2xl">👥</span>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Empleados</p>
            </div>
            <p class="text-3xl font-black text-slate-800 mt-2">{{ stats.total || 0 }}</p>
          </div>
          
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center gap-1 border-l-4 border-l-emerald-500">
            <div class="flex items-center justify-between">
              <span class="text-2xl">✅</span>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activos</p>
            </div>
            <p class="text-3xl font-black text-emerald-600 mt-2">{{ stats.activos || 0 }}</p>
          </div>

          <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center gap-1 border-l-4 border-l-red-500">
            <div class="flex items-center justify-between">
              <span class="text-2xl">🛑</span>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inactivos</p>
            </div>
            <p class="text-3xl font-black text-red-600 mt-2">{{ stats.inactivos || 0 }}</p>
          </div>

          <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center gap-1 border-l-4 border-l-yellow-500">
            <div class="flex items-center justify-between">
              <span class="text-2xl">🎫</span>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tickets Ptes.</p>
            </div>
            <p class="text-3xl font-black text-yellow-600 mt-2">{{ stats.tickets || 0 }}</p>
          </div>
        </div>

        <!-- CHARTS & ALERTS SECTION -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <!-- Empleados por Departamento (Bar Chart) -->
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:col-span-2 min-h-[300px]">
            <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Distribución por Departamento</h2>
            <div class="flex-1 relative w-full h-full flex justify-center items-center">
              <Bar v-if="!loadingDepts" :data="chartDeptData" :options="barOptions" />
              <span v-else class="text-slate-400 italic text-xs">Cargando distribución...</span>
            </div>
          </div>

          <!-- Alertas y Estado -->
          <div class="flex flex-col gap-4">
            <!-- Chart 2: Empleados por Estado (Doughnut) -->
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[200px]">
              <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Estado de Plantilla</h2>
              <div class="flex-1 relative w-full h-full flex justify-center items-center">
                <Doughnut v-if="!loadingStats" :data="chartEstadoData" :options="doughnutOptions" />
              </div>
            </div>
            
            <!-- Alertas Rápidas -->
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col flex-1">
              <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-3">Alertas</h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-100">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">📄</span>
                    <span class="text-xs font-bold text-orange-800">Contratos (30d)</span>
                  </div>
                  <span class="text-sm font-black text-orange-600">{{ stats.vencimientos || 0 }}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">🎂</span>
                    <span class="text-xs font-bold text-purple-800">Cumpleaños</span>
                  </div>
                  <span class="text-sm font-black text-purple-600">{{ stats.cumpleaneros || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: EMPLEADOS -->
      <div v-if="activeTab === 'empleados'" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-100 pb-4">
          <h2 class="text-lg font-black text-slate-800 uppercase tracking-tighter">Directorio Analítico</h2>
          <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <input v-model="empleadosFiltro" type="text" placeholder="Buscar por nombre o código..." class="p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 w-full md:w-64 focus:border-blue-500 outline-none">
            <select v-model="empleadosEstado" class="p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:border-blue-500 outline-none">
              <option value="todos">Todos los Estados</option>
              <option value="1">Activos</option>
              <option value="0">Inactivos</option>
            </select>
            <button @click="exportarCSV(empleadosFiltrados, 'Reporte_Empleados')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2">
              <span>📊</span> CSV
            </button>
          </div>
        </div>

        <div v-if="loadingEmpleados" class="text-center py-10 text-slate-400 italic">Cargando datos de empleados...</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Código</th>
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Empleado</th>
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identidad</th>
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Puesto</th>
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Departamento</th>
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="emp in empleadosFiltrados" :key="emp.id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td class="p-3 text-xs font-bold text-slate-700">{{ emp.codigo_empleado || 'N/A' }}</td>
                <td class="p-3 text-sm font-bold text-slate-900">{{ emp.nombre }} {{ emp.apellido }}</td>
                <td class="p-3 text-xs text-slate-600">{{ emp.numero_identidad || 'N/A' }}</td>
                <td class="p-3 text-xs text-slate-600">{{ emp.puesto || 'N/A' }}</td>
                <td class="p-3 text-xs font-medium text-slate-800">{{ getNombreDepartamento(emp.departamento_id) }}</td>
                <td class="p-3 text-center">
                  <span :class="emp.estado == 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    {{ emp.estado == 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
              </tr>
              <tr v-if="empleadosFiltrados.length === 0">
                <td colspan="6" class="p-6 text-center text-slate-400 italic">No se encontraron empleados con los filtros aplicados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB: TICKETS -->
      <div v-if="activeTab === 'tickets'" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-100 pb-4">
          <h2 class="text-lg font-black text-slate-800 uppercase tracking-tighter">Análisis de Soporte</h2>
          <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <select v-model="ticketsFiltroEstado" class="p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:border-blue-500 outline-none">
              <option value="todos">Todos los Estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Resuelto">Resueltos</option>
              <option value="Cerrado">Cerrados</option>
            </select>
            <select v-model="ticketsFiltroPrioridad" class="p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:border-blue-500 outline-none">
              <option value="todos">Todas las Prioridades</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </select>
            <button @click="exportarCSV(ticketsFiltrados, 'Reporte_Tickets')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2">
              <span>📊</span> CSV
            </button>
          </div>
        </div>

        <!-- KPIs de Tickets Internos -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Tickets</p>
            <p class="text-2xl font-black text-slate-800 mt-1">{{ ticketsFiltrados.length }}</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
            <p class="text-[10px] font-black text-yellow-700 uppercase tracking-widest">Pendientes / Progreso</p>
            <p class="text-2xl font-black text-yellow-600 mt-1">{{ ticketsFiltrados.filter(t => t.estado === 'Pendiente' || t.estado === 'En Progreso').length }}</p>
          </div>
          <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
            <p class="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Resueltos / Cerrados</p>
            <p class="text-2xl font-black text-emerald-600 mt-1">{{ ticketsFiltrados.filter(t => t.estado === 'Resuelto' || t.estado === 'Cerrado').length }}</p>
          </div>
        </div>

        <div v-if="loadingTickets" class="text-center py-10 text-slate-400 italic">Cargando datos de tickets...</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID</th>
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Asunto</th>
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Prioridad</th>
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</th>
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Creado Por</th>
                <th class="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in ticketsFiltrados" :key="ticket.id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td class="p-3 text-xs font-bold text-slate-500">#{{ ticket.id }}</td>
                <td class="p-3 text-sm font-bold text-slate-800">{{ ticket.asunto }}</td>
                <td class="p-3 text-xs">
                  <span :class="getBadgeClass(ticket.prioridad)" class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    {{ ticket.prioridad }}
                  </span>
                </td>
                <td class="p-3 text-xs">
                  <span :class="getBadgeClass(ticket.estado)" class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    {{ ticket.estado }}
                  </span>
                </td>
                <td class="p-3 text-xs text-slate-600">{{ ticket.creadoPorNombre || 'Desconocido' }}</td>
                <td class="p-3 text-xs text-slate-500">{{ new Date(ticket.fecha_creacion).toLocaleDateString() }}</td>
              </tr>
              <tr v-if="ticketsFiltrados.length === 0">
                <td colspan="6" class="p-6 text-center text-slate-400 italic">No se encontraron tickets con los filtros aplicados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    <!-- Modal Perfil -->
    <div v-if="modalAbiertoPerfil" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div class="bg-white w-full max-w-md overflow-hidden rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b bg-white flex justify-between items-center">
          <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">👤 Perfil de Usuario</h2>
          <button @click="cerrarModalPerfil" class="text-slate-400 hover:text-red-500 transition text-2xl">&times;</button>
        </div>

        <form @submit.prevent="cambiarPassword" class="p-8 space-y-6">
          <div class="mb-6 flex flex-col items-center">
            <div class="relative group cursor-pointer" @click="triggerFileInputPerfil">
              <div v-if="fotoUsuario" class="h-20 w-20 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-slate-100 shadow-lg mb-4">
                <img :src="`http://localhost:3007${fotoUsuario}`" class="w-full h-full object-cover" />
              </div>
              <div v-else class="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-black text-3xl ring-4 ring-slate-100 uppercase mb-4 shadow-lg">
                {{ usuarioActual ? usuarioActual.charAt(0) : 'U' }}
              </div>
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/50 mb-4">
                <span class="text-white text-[10px] font-bold px-2 py-1 text-center">Cambiar<br>Foto</span>
              </div>
              <input type="file" ref="fileInputPerfil" class="hidden" accept="image/*" @change="uploadFotoPerfil" />
            </div>
            <h3 class="text-xl font-black text-slate-900">{{ usuarioActual }}</h3>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{{ rolNombre }}</p>
          </div>

          <div>
            <h3 class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 border-b pb-2">Seguridad - Cambiar Contraseña</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contraseña Actual</label>
                <input v-model="formPassword.actual" type="password" required class="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nueva Contraseña</label>
                <input v-model="formPassword.nueva" type="password" required class="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Confirmar Contraseña</label>
                <input v-model="formPassword.confirmar" type="password" required class="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500">
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button type="button" @click="cerrarModalPerfil" class="px-6 py-3 text-slate-400 font-bold uppercase text-xs">Cancelar</button>
            <button type="submit" :disabled="loadingPassword" class="px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs shadow-lg shadow-blue-200">
              {{ loadingPassword ? 'Actualizando...' : 'Actualizar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Doughnut, Bar } from 'vue-chartjs'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const router = useRouter()
const rolID = ref(null)
const rolNombre = ref('Cargando...')
const menuUsuario = ref([])
const usuarioActual = ref('')
const mobileMenuOpen = ref(false)
const activeTab = ref('dashboard')

// Lógica Modal Perfil
const dropdownPerfilAbierto = ref(false)
const modalAbiertoPerfil = ref(false)
const loadingPassword = ref(false)
const formPassword = ref({ actual: '', nueva: '', confirmar: '' })
const fileInputPerfil = ref(null)
const fotoUsuario = ref(null)

const triggerFileInputPerfil = () => { fileInputPerfil.value.click() }

const uploadFotoPerfil = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  const formData = new FormData()
  formData.append('foto', file)
  try {
    const id = localStorage.getItem('usuarioID')
    const res = await axios.post(`http://localhost:3007/api/auth/${id}/foto`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    fotoUsuario.value = res.data.fotoUrl
    localStorage.setItem('usuarioFoto', res.data.fotoUrl)
    alert('✅ ' + res.data.mensaje)
  } catch (err) {
    alert('❌ Error al subir la foto')
  }
}

const abrirModalPerfil = () => { modalAbiertoPerfil.value = true }
const cerrarModalPerfil = () => {
  modalAbiertoPerfil.value = false
  formPassword.value = { actual: '', nueva: '', confirmar: '' }
}

const cambiarPassword = async () => {
  if (formPassword.value.nueva !== formPassword.value.confirmar) {
    alert('❌ Las contraseñas nuevas no coinciden')
    return
  }
  try {
    loadingPassword.value = true
    const userId = localStorage.getItem('usuarioID')
    const res = await axios.put(`http://localhost:3007/api/auth/${userId}/password`, { actual: formPassword.value.actual, nueva: formPassword.value.nueva })
    alert('✅ ' + res.data.mensaje)
    cerrarModalPerfil()
  } catch (err) {
    alert('❌ ' + (err.response?.data?.error || 'Error al cambiar contraseña'))
  } finally {
    loadingPassword.value = false
  }
}

// --- DATOS GLOBALES ---
const departamentos = ref([])
const cargarDepartamentos = async () => {
  try {
    const res = await axios.get('http://localhost:3007/api/departamentos/lista')
    departamentos.value = res.data
  } catch (error) {
    console.error('Error cargando departamentos:', error)
  }
}

const getNombreDepartamento = (id) => {
  const depto = departamentos.value.find(d => d.id === id)
  return depto ? depto.nombre : 'Desconocido'
}

// --- ESTADÍSTICAS DASHBOARD ---
const stats = ref({})
const loadingStats = ref(true)
const deptStats = ref([])
const loadingDepts = ref(true)

const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 10, family: "'Inter', sans-serif" } } } }, cutout: '60%' }
const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => ` ${context.raw} Empleados` } } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } } }

const chartEstadoData = computed(() => ({
  labels: ['Activos', 'Inactivos'],
  datasets: [{ backgroundColor: ['#10b981', '#ef4444'], borderWidth: 0, data: [stats.value.activos || 0, stats.value.inactivos || 0] }]
}))

const chartDeptData = computed(() => {
  return {
    labels: deptStats.value.map(d => d.departamento),
    datasets: [{ label: 'Empleados', backgroundColor: '#3b82f6', borderRadius: 4, data: deptStats.value.map(d => d.cantidad) }]
  }
})

const cargarStats = async () => {
  try {
    loadingStats.value = true
    const res = await axios.get('http://localhost:3007/api/stats/resumen')
    stats.value = res.data
  } catch (error) { console.error('Error cargando estadísticas', error) } 
  finally { loadingStats.value = false }
}

const cargarDepartamentosStats = async () => {
  try {
    loadingDepts.value = true
    const res = await axios.get('http://localhost:3007/api/stats/empleados-por-departamento')
    deptStats.value = res.data
  } catch (error) { console.error('Error cargando stats de departamentos', error) } 
  finally { loadingDepts.value = false }
}

// --- EMPLEADOS REPORTE ---
const empleados = ref([])
const loadingEmpleados = ref(false)
const empleadosFiltro = ref('')
const empleadosEstado = ref('todos')

const cargarEmpleados = async () => {
  try {
    loadingEmpleados.value = true
    const res = await axios.get('http://localhost:3007/api/empleados/lista')
    empleados.value = res.data
  } catch (e) {
    console.error('Error cargando empleados:', e)
  } finally {
    loadingEmpleados.value = false
  }
}

const empleadosFiltrados = computed(() => {
  let list = empleados.value
  if (empleadosEstado.value !== 'todos') {
    list = list.filter(e => e.estado == empleadosEstado.value)
  }
  if (empleadosFiltro.value.trim() !== '') {
    const q = empleadosFiltro.value.toLowerCase()
    list = list.filter(e => 
      (e.nombre && e.nombre.toLowerCase().includes(q)) || 
      (e.apellido && e.apellido.toLowerCase().includes(q)) ||
      (e.codigo_empleado && e.codigo_empleado.toLowerCase().includes(q))
    )
  }
  return list
})

// --- TICKETS REPORTE ---
const tickets = ref([])
const loadingTickets = ref(false)
const ticketsFiltroEstado = ref('todos')
const ticketsFiltroPrioridad = ref('todos')

const cargarTickets = async () => {
  try {
    loadingTickets.value = true
    const res = await axios.get('http://localhost:3007/api/tickets/lista')
    tickets.value = res.data
  } catch (e) {
    console.error('Error cargando tickets:', e)
  } finally {
    loadingTickets.value = false
  }
}

const ticketsFiltrados = computed(() => {
  let list = tickets.value
  if (ticketsFiltroEstado.value !== 'todos') {
    list = list.filter(t => t.estado === ticketsFiltroEstado.value)
  }
  if (ticketsFiltroPrioridad.value !== 'todos') {
    list = list.filter(t => t.prioridad === ticketsFiltroPrioridad.value)
  }
  return list
})

const getBadgeClass = (val) => {
  const map = {
    'Baja': 'bg-slate-100 text-slate-600',
    'Media': 'bg-blue-100 text-blue-700',
    'Alta': 'bg-orange-100 text-orange-700',
    'Urgente': 'bg-red-100 text-red-700',
    'Pendiente': 'bg-yellow-100 text-yellow-700',
    'En Progreso': 'bg-blue-100 text-blue-700',
    'Resuelto': 'bg-emerald-100 text-emerald-700',
    'Cerrado': 'bg-slate-200 text-slate-700'
  }
  return map[val] || 'bg-gray-100 text-gray-700'
}

// --- UTILIDADES ---
const exportarCSV = (dataList, filename) => {
  if (!dataList || dataList.length === 0) {
    alert("No hay datos para exportar")
    return
  }
  
  // Extraer las llaves para el header del CSV de la primera fila
  const keys = Object.keys(dataList[0]).filter(k => k !== 'foto' && k !== 'archivo' && !k.includes('password'))
  
  let csvContent = keys.join(',') + '\n'
  
  dataList.forEach(row => {
    let values = keys.map(k => {
      let val = row[k] === null || row[k] === undefined ? '' : row[k]
      // Si es un ID de departamento en empleados, intentamos resolver el nombre
      if (k === 'departamento_id') val = getNombreDepartamento(val)
      if (k === 'estado' && typeof val === 'number') val = val === 1 ? 'Activo' : 'Inactivo'
      
      // Sanitizar el valor por si tiene comas
      val = String(val).replace(/"/g, '""')
      if (val.search(/("|,|\n)/g) >= 0) {
        val = `"${val}"`
      }
      return val
    })
    csvContent += values.join(',') + '\n'
  })

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const imprimirReporte = () => {
  window.print();
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

onMounted(async () => {
  rolID.value = localStorage.getItem('usuarioRol') || 2
  usuarioActual.value = localStorage.getItem('usuarioNombre') || 'Usuario Sistema'
  fotoUsuario.value = localStorage.getItem('usuarioFoto') || null

  if (rolID.value == 1) {
    rolNombre.value = 'Administrador IT'
  } else if (rolID.value == 2) {
    rolNombre.value = 'Recursos Humanos'
  } else {
    rolNombre.value = 'Empleado'
  }

  try {
    const m = await axios.get(`http://localhost:3007/api/menu/${rolID.value}`)
    menuUsuario.value = m.data
  } catch (e) {
    console.error('Error cargando menú', e)
  }

  // Cargar todos los datos para las diferentes pestañas
  await cargarDepartamentos()
  cargarStats()
  cargarDepartamentosStats()
  cargarEmpleados()
  cargarTickets()
})
</script>

<style>
@media print {
  .no-print {
    display: none !important;
  }
  .printable-area {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }
  aside, button {
    display: none !important;
  }
  body {
    background: white;
  }
}
</style>