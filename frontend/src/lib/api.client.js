import { HOST } from '@/utils/contanst'
import axios from 'axios'

const apiClient=axios.create({
    baseURL:HOST
})