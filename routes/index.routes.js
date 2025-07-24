const userRoutes = require('./user.routes')
const contentRoutes = require('./content.routes')
const { http_codes, messages } = require('../constant/text.constant')
const { error } = require('../common/res.common')

const routes = async ({ app }) => {
    // Health check route
    app.get('/health', (req, res) => {
        res.status(http_codes.ok).json({
            success: true,
            message: 'AI CMS Backend is running',
            timestamp: new Date().toISOString()
        })
    })

    // API routes
    app.use('/api/user', userRoutes)
    app.use('/api/content', contentRoutes)

    // 404 error
    app.use((req, res) => {
        return error({
            code: http_codes.notFound,
            message: messages.notFound,
            req,
            res
        })
    })
}

module.exports = routes