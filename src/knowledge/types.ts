export interface KnowledgeModel {
  name: string;
  description: string;
}

export interface CurriculumTopic {
  id: string;
  strand: string;
  topic: string;
  description: string;
  skills: string[];
  models: KnowledgeModel[];
  keywords: string[];
}
