<template>
  <AppLayout>
    <div class="relative overflow-hidden">
      <!-- Hero Section with Parallax Background -->
      <div
        class="relative min-h-screen flex items-center justify-center"
        :style="{ transform: `translateY(${scrollY * 0.5}px)` }"
      >
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden">
          <!-- Gradient Background -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary-50 via-surface-50 to-success-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900"
          ></div>

          <!-- Floating geometric shapes -->
          <div
            class="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-primary-300 to-primary-500 dark:from-primary-700 dark:to-primary-900 rounded-full opacity-30 animate-float shadow-2xl"
            :style="{ transform: `translateY(${scrollY * 0.5}px) rotate(${scrollY * 0.2}deg)` }"
          ></div>
          <div
            class="absolute top-40 right-32 w-32 h-32 bg-gradient-to-br from-success-300 to-success-500 dark:from-success-700 dark:to-success-900 rounded-lg opacity-40 animate-float-delayed shadow-2xl"
            :style="{ transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * -0.15}deg)` }"
          ></div>
          <div
            class="absolute bottom-40 left-1/4 w-28 h-28 bg-gradient-to-br from-warn-300 to-warn-500 dark:from-warn-700 dark:to-warn-900 rounded-full opacity-35 animate-pulse shadow-2xl"
            :style="{ transform: `translateY(${scrollY * 0.6}px)` }"
          ></div>
          <div
            class="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-300 to-purple-500 dark:from-purple-700 dark:to-purple-900 rounded-full opacity-25 animate-float"
            :style="{ transform: `translateY(${scrollY * -0.4}px) rotate(${scrollY * 0.1}deg)` }"
          ></div>

          <!-- Grid pattern -->
          <div class="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-20"></div>

          <!-- Floating particles -->
          <div class="absolute inset-0">
            <div
              v-for="i in 20"
              :key="i"
              class="absolute w-2 h-2 bg-primary-400 dark:bg-primary-600 rounded-full opacity-60 animate-pulse"
              :style="{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                transform: `translateY(${scrollY * (0.1 + Math.random() * 0.3)}px)`,
              }"
            ></div>
          </div>
        </div>

        <!-- Hero Content -->
        <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="mb-6 animate-fade-in-up">
            <h1
              class="text-5xl md:text-7xl font-bold text-surface-900 dark:text-surface-100 mb-4 leading-tight"
            >
              Welcome back,
              <span
                class="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
              >
                {{ authStore.user?.name?.split(' ')[0] }}!
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-surface-600 dark:text-surface-400 mb-6">
              Ready to accelerate your learning journey?
            </p>
          </div>

          <!-- Quick Stats Cards with Hover Effects -->
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 animate-fade-in-up animation-delay-300"
          >
            <div
              class="group card p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <div class="flex flex-col items-center">
                <div
                  class="p-3 bg-primary-100 dark:bg-primary-900 rounded-full mb-3 group-hover:scale-110 transition-transform"
                >
                  <BookOpenIcon class="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <p class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {{ libraryStore.items.length }}
                </p>
                <p class="text-sm text-surface-600 dark:text-surface-400">Documents</p>
              </div>
            </div>

            <div
              class="group card p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <div class="flex flex-col items-center">
                <div
                  class="p-3 bg-success-100 dark:bg-success-900 rounded-full mb-3 group-hover:scale-110 transition-transform"
                >
                  <ClockIcon class="h-8 w-8 text-success-600 dark:text-success-400" />
                </div>
                <p class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {{ Math.round(analyticsStore.globalMetrics.totalStudyMin / 60) }}h
                </p>
                <p class="text-sm text-surface-600 dark:text-surface-400">Study Time</p>
              </div>
            </div>

            <div
              class="group card p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <div class="flex flex-col items-center">
                <div
                  class="p-3 bg-warn-100 dark:bg-warn-900 rounded-full mb-3 group-hover:scale-110 transition-transform"
                >
                  <ChartBarIcon class="h-8 w-8 text-warn-600 dark:text-warn-400" />
                </div>
                <p class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {{ analyticsStore.globalMetrics.avgScore }}%
                </p>
                <p class="text-sm text-surface-600 dark:text-surface-400">Avg Score</p>
              </div>
            </div>

            <div
              class="group card p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <div class="flex flex-col items-center">
                <div
                  class="p-3 bg-error-100 dark:bg-error-900 rounded-full mb-3 group-hover:scale-110 transition-transform"
                >
                  <FireIcon class="h-8 w-8 text-error-600 dark:text-error-400" />
                </div>
                <p class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {{ analyticsStore.globalMetrics.streakDays }}
                </p>
                <p class="text-sm text-surface-600 dark:text-surface-400">Day Streak</p>
              </div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600"
          >
            <router-link to="/library" class="btn-primary btn-lg group">
              <CloudArrowUpIcon class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Upload New Document
            </router-link>
            <router-link to="/tutor" class="btn-outline btn-lg group">
              <ChatBubbleLeftRightIcon
                class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform"
              />
              Ask AI Tutor
            </router-link>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDownIcon class="h-8 w-8 text-surface-400" />
        </div>
      </div>

      <!-- Content Sections with Parallax -->
      <div class="relative bg-surface-50 dark:bg-surface-900">
        <!-- Recent Documents Section -->
        <section class="py-16 relative" :style="{ transform: `translateY(${scrollY * 0.1}px)` }">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-10">
              <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-3">
                Recent Documents
              </h2>
              <p class="text-xl text-surface-600 dark:text-surface-400">
                Continue where you left off
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                v-for="(item, index) in recentItems"
                :key="item.id"
                class="group card p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                :class="`animate-fade-in-up animation-delay-${(index + 1) * 200}`"
                @click="$router.push(`/library/${item.id}`)"
              >
                <div class="flex items-start space-x-4 mb-4">
                  <div
                    class="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg group-hover:scale-110 transition-transform"
                  >
                    <component
                      :is="getItemIcon(item.type)"
                      class="h-6 w-6 text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <div class="flex-1">
                    <h3
                      class="font-semibold text-surface-900 dark:text-surface-100 group-hover:text-primary-600 transition-colors"
                    >
                      {{ item.title }}
                    </h3>
                    <p class="text-sm text-surface-500 dark:text-surface-400">
                      {{ formatDate(item.createdAt) }}
                    </p>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="tag in item.tags.slice(0, 3)"
                    :key="tag"
                    class="badge-secondary text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>

                <div class="flex space-x-2">
                  <button
                    class="btn-outline btn-sm flex-1"
                    @click.stop="$router.push(`/tutor?item=${item.id}`)"
                  >
                    Ask AI
                  </button>
                  <button
                    class="btn-primary btn-sm flex-1"
                    @click.stop="$router.push(`/study?item=${item.id}`)"
                  >
                    Study
                  </button>
                </div>
              </div>
            </div>

            <div class="text-center mt-12">
              <router-link to="/library" class="btn-outline btn-lg">
                View All Documents
                <ArrowRightIcon class="h-5 w-5 ml-2" />
              </router-link>
            </div>
          </div>
        </section>

        <!-- Learning Progress Section -->
        <section
          class="py-16 bg-white dark:bg-surface-800 relative overflow-hidden"
          :style="{ transform: `translateY(${scrollY * 0.08}px)` }"
        >
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-10 animate-fade-in-up">
              <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-3">
                Your Learning Progress
              </h2>
              <p class="text-xl text-surface-600 dark:text-surface-400">
                Track your journey and celebrate milestones
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <!-- Progress Chart -->
              <div class="card p-8 animate-slide-in-left animation-delay-200">
                <h3 class="text-2xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
                  Weekly Study Hours
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-surface-600 dark:text-surface-400">This Week</span>
                    <span class="font-semibold text-surface-900 dark:text-surface-100"
                      >8.5 hours</span
                    >
                  </div>
                  <div class="bg-surface-200 dark:bg-surface-700 rounded-full h-4">
                    <div
                      class="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full"
                      style="width: 85%"
                    ></div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-surface-600 dark:text-surface-400">Last Week</span>
                    <span class="font-semibold text-surface-900 dark:text-surface-100"
                      >6.2 hours</span
                    >
                  </div>
                  <div class="bg-surface-200 dark:bg-surface-700 rounded-full h-4">
                    <div
                      class="bg-gradient-to-r from-success-500 to-success-600 h-4 rounded-full"
                      style="width: 62%"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Skill Progress -->
              <div class="card p-8 animate-slide-in-right animation-delay-400">
                <h3 class="text-2xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
                  Skill Development
                </h3>
                <div class="space-y-6">
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"
                    >
                      <span class="text-white font-bold">JS</span>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between mb-2">
                        <span class="font-medium text-surface-900 dark:text-surface-100"
                          >JavaScript</span
                        >
                        <span class="text-sm text-surface-600 dark:text-surface-400">78%</span>
                      </div>
                      <div class="bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                        <div
                          class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                          style="width: 78%"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center"
                    >
                      <span class="text-white font-bold">PY</span>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between mb-2">
                        <span class="font-medium text-surface-900 dark:text-surface-100"
                          >Python</span
                        >
                        <span class="text-sm text-surface-600 dark:text-surface-400">65%</span>
                      </div>
                      <div class="bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                        <div
                          class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style="width: 65%"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center"
                    >
                      <span class="text-white font-bold">AI</span>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between mb-2">
                        <span class="font-medium text-surface-900 dark:text-surface-100"
                          >Machine Learning</span
                        >
                        <span class="text-sm text-surface-600 dark:text-surface-400">45%</span>
                      </div>
                      <div class="bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                        <div
                          class="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                          style="width: 45%"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Actions Section -->
        <section
          class="py-16 bg-gradient-to-br from-surface-50 to-primary-50 dark:from-surface-900 dark:to-surface-800 relative overflow-hidden"
          :style="{ transform: `translateY(${scrollY * 0.06}px)` }"
        >
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-10 animate-fade-in-up">
              <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-3">
                Quick Actions
              </h2>
              <p class="text-xl text-surface-600 dark:text-surface-400">
                Jump into your learning activities
              </p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div
                v-for="(action, index) in quickActions"
                :key="action.id"
                class="group card p-6 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                :class="`animate-scale-in animation-delay-${(index + 1) * 200}`"
                @click="handleQuickAction(action)"
              >
                <div
                  class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  :class="action.bgClass"
                >
                  <component :is="action.icon" class="h-8 w-8 text-white" />
                </div>
                <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  {{ action.title }}
                </h3>
                <p class="text-sm text-surface-600 dark:text-surface-400">
                  {{ action.description }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Study Streak Section -->
        <section
          class="py-12 bg-gradient-to-r from-warn-50 to-success-50 dark:from-warn-900 dark:to-success-900 relative overflow-hidden"
          :style="{ transform: `translateY(${scrollY * 0.04}px)` }"
        >
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="card p-8 animate-fade-in-up">
              <div class="flex items-center justify-center mb-4">
                <div
                  class="w-20 h-20 bg-gradient-to-br from-warn-500 to-warn-600 rounded-full flex items-center justify-center animate-pulse"
                >
                  <FireIcon class="h-10 w-10 text-white" />
                </div>
              </div>
              <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-3">
                🔥 {{ analyticsStore.globalMetrics.streakDays }} Day Streak!
              </h2>
              <p class="text-lg text-surface-600 dark:text-surface-400 mb-6">
                You're on fire! Keep up the amazing work and maintain your learning momentum.
              </p>
              <div class="flex justify-center space-x-8">
                <div class="text-center">
                  <div class="text-3xl font-bold text-surface-900 dark:text-surface-100">
                    {{ analyticsStore.globalMetrics.totalStudyMin }}
                  </div>
                  <div class="text-sm text-surface-600 dark:text-surface-400">Minutes Studied</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-surface-900 dark:text-surface-100">
                    {{ analyticsStore.globalMetrics.avgScore }}%
                  </div>
                  <div class="text-sm text-surface-600 dark:text-surface-400">Average Score</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-surface-900 dark:text-surface-100">
                    {{ libraryStore.items.length }}
                  </div>
                  <div class="text-sm text-surface-600 dark:text-surface-400">Documents</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Recommended Content Section -->
        <section
          class="py-12 bg-white dark:bg-surface-800 relative overflow-hidden"
          :style="{ transform: `translateY(${scrollY * 0.04}px)` }"
        >
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-10 animate-fade-in-up">
              <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-3">
                Recommended For You
              </h2>
              <p class="text-xl text-surface-600 dark:text-surface-400">
                Based on your recent activity and interests
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                v-for="(item, index) in recommendedItems"
                :key="item.id"
                class="group card p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                :class="`animate-fade-in-up animation-delay-${(index + 1) * 150}`"
                @click="$router.push(`/library/${item.id}`)"
              >
                <div class="flex items-start space-x-4 mb-4">
                  <div
                    class="p-3 bg-success-100 dark:bg-success-900 rounded-lg group-hover:scale-110 transition-transform"
                  >
                    <component
                      :is="getItemIcon(item.type)"
                      class="h-6 w-6 text-success-600 dark:text-success-400"
                    />
                  </div>
                  <div class="flex-1">
                    <h3
                      class="font-semibold text-surface-900 dark:text-surface-100 group-hover:text-success-600 transition-colors"
                    >
                      {{ item.title }}
                    </h3>
                    <p class="text-sm text-surface-500 dark:text-surface-400">
                      {{ item.source }}
                    </p>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="tag in item.tags.slice(0, 3)"
                    :key="tag"
                    class="badge-secondary text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>

                <div class="flex space-x-2">
                  <button
                    class="btn-outline btn-sm flex-1 group-hover:bg-success-50 group-hover:border-success-300 transition-colors"
                    @click.stop="$router.push(`/tutor?item=${item.id}`)"
                  >
                    Ask AI
                  </button>
                  <button
                    class="btn-primary btn-sm flex-1 group-hover:bg-primary-700 transition-colors"
                    @click.stop="$router.push(`/study?item=${item.id}`)"
                  >
                    Study
                  </button>
                </div>
              </div>
            </div>

            <div class="text-center mt-12 animate-fade-in-up animation-delay-800">
              <router-link to="/library" class="btn-outline btn-lg group">
                Explore More Content
                <ArrowRightIcon
                  class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                />
              </router-link>
            </div>
          </div>
        </section>

        <!-- Achievement Badges Section -->
        <section
          class="py-12 bg-gradient-to-br from-surface-50 to-primary-50 dark:from-surface-900 dark:to-surface-800 relative overflow-hidden"
          :style="{ transform: `translateY(${scrollY * 0.04}px)` }"
        >
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-10 animate-fade-in-up">
              <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-3">
                Your Achievements
              </h2>
              <p class="text-xl text-surface-600 dark:text-surface-400">
                Celebrate your milestones and progress
              </p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div
                v-for="(badge, index) in achievementBadges"
                :key="index"
                class="group card p-6 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                :class="`animate-scale-in animation-delay-${(index + 1) * 100}`"
              >
                <div
                  class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                  :class="badge.bgClass"
                >
                  <component :is="badge.icon" class="h-8 w-8 text-white" />
                </div>
                <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-2 text-sm">
                  {{ badge.title }}
                </h3>
                <p class="text-xs text-surface-600 dark:text-surface-400">
                  {{ badge.description }}
                </p>
              </div>
            </div>

            <div class="text-center mt-8 animate-fade-in-up animation-delay-800">
              <router-link to="/analytics" class="btn-primary btn-lg group">
                View All Achievements
                <TrophyIcon class="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
              </router-link>
            </div>
          </div>
        </section>

        <!-- Feature Showcase -->
        <section
          class="py-12 bg-white dark:bg-surface-800 relative overflow-hidden"
          :style="{ transform: `translateY(${scrollY * 0.04}px)` }"
        >
          <!-- Background decoration -->
          <div class="absolute top-0 right-0 -translate-y-12 translate-x-12">
            <div
              class="w-96 h-96 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full opacity-20"
            ></div>
          </div>

          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-8">
              <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-3">
                Supercharge Your Learning
              </h2>
              <p class="text-xl text-surface-600 dark:text-surface-400">
                AI-powered tools to accelerate your education
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="text-center group">
                <div
                  class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                >
                  <CloudArrowUpIcon class="h-10 w-10 text-white" />
                </div>
                <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-3">
                  Upload Content
                </h3>
                <p class="text-surface-600 dark:text-surface-400">
                  Upload PDFs, videos, slides, and more to create your learning library
                </p>
              </div>

              <div class="text-center group">
                <div
                  class="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                >
                  <ChatBubbleLeftRightIcon class="h-10 w-10 text-white" />
                </div>
                <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-3">
                  AI Tutor
                </h3>
                <p class="text-surface-600 dark:text-surface-400">
                  Chat with AI to get explanations, ask questions, and clarify concepts
                </p>
              </div>

              <div class="text-center group">
                <div
                  class="w-20 h-20 bg-gradient-to-br from-warn-500 to-warn-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                >
                  <AcademicCapIcon class="h-10 w-10 text-white" />
                </div>
                <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-3">
                  Smart Study
                </h3>
                <p class="text-surface-600 dark:text-surface-400">
                  Generate quizzes, flashcards, and summaries automatically
                </p>
              </div>

              <div class="text-center group">
                <div
                  class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                >
                  <ChartBarIcon class="h-10 w-10 text-white" />
                </div>
                <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-3">
                  Track Progress
                </h3>
                <p class="text-surface-600 dark:text-surface-400">
                  Monitor your learning with detailed analytics and insights
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Testimonials Section -->
        <section
          class="py-20 pb-60 bg-gradient-to-br from-primary-50 to-success-50 dark:from-surface-800 dark:to-surface-900 relative overflow-hidden"
          :style="{ transform: `translateY(${scrollY * 0.04}px)` }"
        >
          <!-- Background decoration -->
          <div class="absolute inset-0">
            <div
              class="absolute top-10 left-10 w-32 h-32 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 animate-float"
            ></div>
            <div
              class="absolute bottom-10 right-10 w-24 h-24 bg-success-200 dark:bg-success-800 rounded-full opacity-30 animate-float-delayed"
            ></div>
          </div>

          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-8 animate-fade-in-up">
              <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-3">
                What Our Users Say
              </h2>
              <p class="text-xl text-surface-600 dark:text-surface-400">
                Join thousands of learners who are accelerating their education
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(testimonial, index) in testimonials"
                :key="index"
                class="card p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                :class="`animate-scale-in animation-delay-${(index + 1) * 200}`"
              >
                <div class="flex items-center mb-6">
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  >
                    {{ testimonial.name.charAt(0) }}
                  </div>
                  <div class="ml-4">
                    <h4 class="font-semibold text-surface-900 dark:text-surface-100">
                      {{ testimonial.name }}
                    </h4>
                    <p class="text-sm text-surface-500 dark:text-surface-400">
                      {{ testimonial.role }}
                    </p>
                  </div>
                </div>
                <blockquote class="text-surface-700 dark:text-surface-300 italic mb-4">
                  "{{ testimonial.quote }}"
                </blockquote>
                <div class="flex text-warn-400">
                  <StarIcon v-for="i in 5" :key="i" class="h-5 w-5 fill-current" />
                </div>
              </div>
            </div>

            <div class="text-center mt-12 animate-fade-in-up animation-delay-800">
              <router-link to="/pricing" class="btn-primary btn-lg group">
                Start Your Learning Journey
                <ArrowRightIcon
                  class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                />
              </router-link>
            </div>
          </div>
        </section>

        <!-- Plan Usage Banner -->
        <section
          v-if="authStore.user?.planId === 'free'"
          class="py-16 bg-gradient-to-r from-warn-50 to-warn-100 dark:from-warn-900 dark:to-warn-800"
          :style="{ transform: `translateY(${scrollY * 0.02}px)` }"
        >
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="bg-white dark:bg-surface-800 rounded-2xl p-8 shadow-xl">
              <div class="flex items-center justify-center mb-6">
                <div class="w-16 h-16 bg-warn-500 rounded-full flex items-center justify-center">
                  <FireIcon class="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4">
                Free Plan Usage
              </h3>
              <div class="flex items-center justify-center mb-6">
                <div class="bg-surface-200 dark:bg-surface-700 rounded-full h-4 w-64">
                  <div
                    class="bg-warn-500 h-4 rounded-full transition-all duration-1000"
                    :style="{ width: `${Math.min((libraryStore.items.length / 3) * 100, 100)}%` }"
                  ></div>
                </div>
                <span class="ml-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
                  {{ libraryStore.items.length }}/3
                </span>
              </div>
              <p class="text-surface-600 dark:text-surface-400 mb-8">
                You've used {{ libraryStore.items.length }} of your 3 free documents. Upgrade to
                unlock unlimited access!
              </p>
              <router-link to="/pricing" class="btn-primary btn-lg">
                Upgrade Now
                <ArrowRightIcon class="h-5 w-5 ml-2" />
              </router-link>
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import {
  BookOpenIcon,
  ClockIcon,
  ChartBarIcon,
  FireIcon,
  CloudArrowUpIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  PlayIcon,
  SpeakerWaveIcon,
  DocumentIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  StarIcon,
  PlusIcon,
  LightBulbIcon,
  TrophyIcon,
  UserGroupIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from '@heroicons/vue/24/outline'
import type { ContentType } from '@/app/types'
import AppLayout from '@/components/AppLayout.vue'
import { useAuthStore } from '@/app/store/auth'
import { useLibraryStore } from '@/app/store/library'
import { useAnalyticsStore } from '@/app/store/analytics'

const authStore = useAuthStore()
const libraryStore = useLibraryStore()
const analyticsStore = useAnalyticsStore()

// Parallax scroll functionality
const scrollY = ref(0)

const handleScroll = () => {
  scrollY.value = window.scrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const recentItems = computed(() => {
  return libraryStore.items.slice(0, 6)
})

const getItemIcon = (type: ContentType) => {
  switch (type) {
    case 'pdf':
      return DocumentTextIcon
    case 'slides':
      return PresentationChartLineIcon
    case 'youtube':
      return PlayIcon
    case 'audio':
      return SpeakerWaveIcon
    default:
      return DocumentIcon
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// Testimonials data
const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science Student',
    quote:
      'EduNow.AI has completely transformed how I study. The AI tutor explains complex algorithms in ways I never understood before. My grades have improved by 30%!',
  },
  {
    name: 'Marcus Johnson',
    role: 'Software Engineer',
    quote:
      'As a working professional, I needed a way to learn new technologies efficiently. The smart study features and progress tracking help me stay on top of my learning goals.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Data Scientist',
    quote:
      "The document upload feature is incredible. I can upload research papers and get instant summaries and quizzes. It's like having a personal research assistant!",
  },
  {
    name: 'David Kim',
    role: 'Product Manager',
    quote:
      'The analytics dashboard shows exactly where I need to focus my learning efforts. The insights are spot-on and help me make data-driven decisions about my education.',
  },
  {
    name: 'Lisa Wang',
    role: 'UX Designer',
    quote:
      "I love how intuitive the interface is. The parallax effects and smooth animations make studying feel engaging rather than tedious. It's beautiful and functional.",
  },
  {
    name: 'Alex Thompson',
    role: 'Marketing Professional',
    quote:
      'The AI tutor is incredibly helpful for understanding complex marketing concepts. It breaks down everything into digestible pieces and provides real-world examples.',
  },
]

// Quick actions data
const quickActions = [
  {
    id: 'upload',
    title: 'Upload Document',
    description: 'Add new content',
    icon: CloudArrowUpIcon,
    bgClass: 'bg-gradient-to-br from-primary-500 to-primary-600',
    route: '/library',
  },
  {
    id: 'tutor',
    title: 'Ask AI Tutor',
    description: 'Get instant help',
    icon: ChatBubbleLeftRightIcon,
    bgClass: 'bg-gradient-to-br from-success-500 to-success-600',
    route: '/tutor',
  },
  {
    id: 'study',
    title: 'Start Study',
    description: 'Take a quiz',
    icon: AcademicCapIcon,
    bgClass: 'bg-gradient-to-br from-warn-500 to-warn-600',
    route: '/study',
  },
  {
    id: 'analytics',
    title: 'View Analytics',
    description: 'Track progress',
    icon: ChartBarIcon,
    bgClass: 'bg-gradient-to-br from-purple-500 to-purple-600',
    route: '/analytics',
  },
]

// Handle quick action clicks
const handleQuickAction = (action: any) => {
  // You can add specific logic here for each action
  if (action.route) {
    window.location.href = action.route
  }
}

// Mock data for Recommended Content Section
const recommendedItems = computed(() => {
  // For demonstration, let's create some mock recommendations
  // In a real app, this would come from a recommendation engine
  const mockRecommendations = [
    {
      id: 'rec-1',
      title: 'Advanced Vue 3 Patterns',
      type: 'pdf' as ContentType,
      source: 'Vue.js Blog',
      tags: ['Vue', 'Frontend', 'Patterns'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rec-2',
      title: 'Introduction to Data Science',
      type: 'slides' as ContentType,
      source: 'Coursera',
      tags: ['Data Science', 'Python', 'Statistics'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rec-3',
      title: 'Effective Communication for Engineers',
      type: 'audio' as ContentType,
      source: 'Podcast',
      tags: ['Soft Skills', 'Career', 'Communication'],
      createdAt: new Date().toISOString(),
    },
  ]
  return mockRecommendations
})

// Mock data for Achievement Badges Section
const achievementBadges = ref([
  {
    title: 'First Upload',
    description: 'Uploaded your first document',
    icon: CloudArrowUpIcon,
    bgClass: 'bg-gradient-to-br from-primary-500 to-primary-600',
  },
  {
    title: 'Study Novice',
    description: 'Completed 5 study sessions',
    icon: AcademicCapIcon,
    bgClass: 'bg-gradient-to-br from-success-500 to-success-600',
  },
  {
    title: 'Streak Starter',
    description: '3-day study streak',
    icon: FireIcon,
    bgClass: 'bg-gradient-to-br from-warn-500 to-warn-600',
  },
  {
    title: 'AI Explorer',
    description: 'Asked 10 AI questions',
    icon: LightBulbIcon,
    bgClass: 'bg-gradient-to-br from-purple-500 to-purple-600',
  },
  {
    title: 'Knowledge Seeker',
    description: 'Explored 5 topics',
    icon: BookOpenIcon,
    bgClass: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
  },
  {
    title: 'Quiz Master',
    description: '90%+ on 3 quizzes',
    icon: TrophyIcon,
    bgClass: 'bg-gradient-to-br from-pink-500 to-pink-600',
  },
])
</script>
