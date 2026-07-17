export type Visibility = 'private' | 'link' | 'public';
export type WishStatus = 'dreaming' | 'exploring' | 'in_progress' | 'on_hold' | 'achieved' | 'abandoned' | 'transformed';
export type StepStatus = 'planned' | 'active' | 'completed' | 'skipped';
export type StepType = 'action' | 'test' | 'milestone' | 'question';
export type OfferType = 'help' | 'idea' | 'know_someone' | 'done_this' | 'join' | 'offer_something';
export interface Profile { id: string; userId: string; displayName: string; avatarUrl?: string; location?: string; bio?: string; offersText?: string; offerTags: string[]; contactEmail?: string; contactWhatsapp?: string; contactUrl?: string; createdAt: string; updatedAt: string; }
export interface Wish { id: string; ownerId: string; ownerName: string; title: string; slug: string; description: string; imageUrl?: string; visibility: Visibility; status: WishStatus; location?: string; targetDate?: string; acceptsHelp: boolean; createdAt: string; updatedAt: string; }
export interface WishStep { id: string; wishId: string; ownerId: string; title: string; description?: string; position: number; status: StepStatus; stepType?: StepType; targetDate?: string; createdAt: string; updatedAt: string; }
export interface WishUpdate { id: string; wishId: string; actorId: string; actorName: string; eventType: string; message: string; createdAt: string; }
export interface HelpOffer { id: string; wishId: string; stepId?: string; wishOwnerId: string; helperId: string; helperName: string; offerType: OfferType; message: string; contactUrl?: string; status: 'offered' | 'accepted' | 'declined' | 'completed'; createdAt: string; updatedAt: string; }
export interface Follow { id: string; wishId: string; userId: string; createdAt: string; }
export interface User { id: string; email: string; name: string; }
export interface WishBundle { wish: Wish; steps: WishStep[]; updates: WishUpdate[]; offers: HelpOffer[]; follows: Follow[]; owner?: Profile; }
