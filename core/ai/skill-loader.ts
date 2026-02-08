/**
 * ÉTER Skill Loader
 * Standardizes "Procedural Knowledge" by loading SKILL.md files.
 */

export interface Skill {
    id: string;
    name: string;
    instructions: string;
    category: 'research' | 'crypto' | 'utility' | 'identity';
}

class SkillLoader {
    private skills: Map<string, Skill> = new Map();

    /**
     * Load a skill from a local or remote URL
     */
    async loadSkill(url: string, id: string): Promise<void> {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Fallo al cargar la habilidad: ${id}`);
            const text = await response.text();

            // Simple parser: Extract instructions from a SKILL.md
            // Usually instructions are everything after the first # or a specific section
            const instructions = text.split('# Instructions')[1] || text;

            this.skills.set(id, {
                id,
                name: id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' '),
                instructions: instructions.trim(),
                category: 'utility'
            });

            console.log(`🧩 Habilidad Instalada: ${id}`);
        } catch (e) {
            console.error(`SkillLoader Error [${id}]:`, e);
        }
    }

    getSystemPrompt(activeSkillIds: string[]): string {
        let prompt = "";
        activeSkillIds.forEach(id => {
            const skill = this.skills.get(id);
            if (skill) {
                prompt += `\n\n[HABILIDAD ACTIVADA: ${skill.name}]\n${skill.instructions}\n`;
            }
        });
        return prompt;
    }

    getLoadedSkills(): Skill[] {
        return Array.from(this.skills.values());
    }
}

export const skillLoader = new SkillLoader();
