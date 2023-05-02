import express from 'express'
import indexCtrl from './../controllers/indexCtrl.js'

const router = express.Router()

router.get('/',indexCtrl.indexPage)

export default router