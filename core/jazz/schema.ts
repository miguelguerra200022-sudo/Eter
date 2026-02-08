import { CoMap, CoList, coField, Account, Profile } from "jazz-tools";

/**
 * Perfil público del usuario.
 */
export class UserProfile extends Profile {
    avatarUrl = coField.string; // O un CoStream de imagen
    color = coField.string; // Para identicons
    kyberKey = coField.string; // Quantum Public Key (Base64)
}

/**
 * Mensaje individual en el chat.
 * En Jazz, cada mensaje es un CoMap collaborative.
 */
export class Message extends CoMap {
    text = coField.string;
    sender = coField.ref(UserProfile, {}); // Referencia al perfil del usuario
    timestamp = coField.number; // Date.now()
}

/**
 * Lista de mensajes en un chat.
 * Usamos CoList para mantener el orden cronológico.
 */
export class MessageList extends CoList.Of(coField.ref(Message, {})) { }

/**
 * Un chat (Conversación).
 * Contiene metadatos y la lista de mensajes.
 */
export class Chat extends CoMap {
    title = coField.string;
    messages = coField.ref(MessageList, {});
}

/**
 * Lista de chats del usuario.
 */
export class ChatList extends CoList.Of(coField.ref(Chat, {})) { }

/**
 * Objeto raíz del usuario.
 */
export class EterRoot extends CoMap {
    chats = coField.ref(ChatList, {});
}

/**
 * La cuenta raíz del usuario (Root Account).
 * Debe extender Account para funcionar como identidad.
 */
export class EterAccount extends Account {
    profile = coField.ref(UserProfile, {}) as unknown as UserProfile;
    root = coField.ref(EterRoot, {}) as unknown as EterRoot;

    // Migración futura: Claves Quantum (Kyber)
    // quantumPublicKey = coField.string;  

    /**
     * Helper to get or create the profile
     */
    async ensureProfile(name: string) {
        if (!this.profile) {
            this.profile = UserProfile.create({
                name,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                kyberKey: "" // Initial empty key
            }, { owner: this as any });
        }
    }
}
