<template>
  <div class="flex">
    <!-- Sidebar -->
    <div class="flex flex-col h-screen p-3 bg-gray-800 text-white w-64">
      <div class="space-y-3">
        <div class="text-2xl font-bold">Menú</div>
        <nav>
          <ul class="space-y-2">
            <li>
              <a
                href="#"
                class="flex items-center p-2 text-base font-semibold text-gray-200 rounded-lg hover:bg-gray-700"
              >
                <span>Inicio</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center p-2 text-base font-semibold text-gray-200 rounded-lg hover:bg-gray-700"
              >
                <span>Perfil</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center p-2 text-base font-semibold text-gray-200 rounded-lg hover:bg-gray-700"
              >
                <span>Configuración</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <!-- Contenido principal -->
    <div class="flex-1 p-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
// Aquí puedes agregar la lógica del componente si es necesario
</script>
