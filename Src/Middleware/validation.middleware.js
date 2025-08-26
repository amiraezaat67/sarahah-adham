


const reqkeys = ['body','params','query','headers']
export const validationMiddleware = (schema) => {
    return (req,res,next) => {
        const validationErrors = []

        for(const key of reqkeys){
            console.log(key)

            if(schema[key]){
                const {error} = schema[key].validate(req[key],{abortEarly:false});
                if(error){
                    validationErrors.push(...error.details)
                }
            
            }
        }

        if(validationErrors.length){
            return res.status(400).json({ message:"Validation error",validationErrors });
        }
        next()
    }
}