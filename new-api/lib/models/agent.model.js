import Joi from 'joi';

class AgentModel {
    static get schema() {

        return {
            id: Joi.string(), // using UUID on redis
            agentName: Joi.string().trim(),
            description: Joi.string().trim(),
            language: Joi.string().trim().valid('en', 'es', 'de', 'fr', 'pt'),
            timezone: Joi.string().trim(),
            useWebhook: Joi.boolean(),
            usePostFormat: Joi.boolean(),
            multiDomain: Joi.boolean(),
            domainClassifierThreshold: Joi.number(),
            fallbackResponses: Joi.array().items(Joi.string().trim()),
            status: Joi.string().trim(),
            lastTraining: Joi.date(),
            extraTrainingData: Joi.boolean(),
            enableModelsPerDomain: Joi.boolean(),
            model: Joi.string().allow('')
        };
    };
}

module.exports = AgentModel;