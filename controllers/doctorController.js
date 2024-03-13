import bcrypt from 'bcrypt'
import Doctor from '../models/Doctor.js'

export const createDoctor = async(req,res)=>{
    try{
        const passwordRegex = new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$')
        const nameRegex = new RegExp('^[A-Za-z0-9]{3,16}$')
        if(!nameRegex.test(req.body.name)) return res.status(500).send('Username should be 3-16 characters and shouldnt include any special character!')
        if(!passwordRegex.test(req.body.password)) return res.status(500).send('Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!')
        const hashedPassword = bcrypt.hashSync(req.body.password,10)
        await new Doctor({...req.body, password: hashedPassword}).save()
        res.status(200).send('Doctor has been added!')
    }catch(error){
        res.json('Something went wrong')
    }
} 