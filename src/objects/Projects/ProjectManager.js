import * as THREE from 'three'
import { createGitHubIsland } from './GitHubIsland.js'

// Manage all project islands in the scene
export function createProjectManager() {
    const projectsGroup = new THREE.Group()
    const projects = new Map()
    
    console.log('🏗️ Creating Project Manager...')
    
    // Create GitHub island
    const githubIsland = createGitHubIsland()
    projects.set('github', githubIsland)
    projectsGroup.add(githubIsland.group)
    
    console.log('📊 Project Manager created!')
    console.log(`🏝️ Active projects: ${projects.size}`)
    
    return {
        group: projectsGroup,
        projects,
        update: (time) => {
            // Update all project islands
            projects.forEach(project => {
                if (project.update) {
                    project.update(time)
                }
            })
        },
        addProject: (name, projectIsland) => {
            projects.set(name, projectIsland)
            projectsGroup.add(projectIsland.group)
            console.log(`➕ Added project: ${name}`)
        },
        removeProject: (name) => {
            const project = projects.get(name)
            if (project) {
                projectsGroup.remove(project.group)
                projects.delete(name)
                console.log(`➖ Removed project: ${name}`)
            }
        },
        getProject: (name) => {
            return projects.get(name)
        },
        getAllProjects: () => {
            return Array.from(projects.keys())
        },
        setProjectVisibility: (name, visible) => {
            const project = projects.get(name)
            if (project && project.setVisibility) {
                project.setVisibility(visible)
            }
        },
        repositionProjects: () => {
            // Auto-arrange projects in a nice formation around the scene
            const projectArray = Array.from(projects.values())
            projectArray.forEach((project, index) => {
                const angle = (index / projectArray.length) * Math.PI * 2
                const radius = 30 + index * 5
                const x = Math.cos(angle) * radius
                const z = Math.sin(angle) * radius - 40
                
                if (project.setPosition) {
                    project.setPosition(x, 0, z)
                }
            })
        }
    }
} 