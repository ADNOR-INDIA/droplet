import React, {useState} from "react"
import Navbar from "./Navbar"

const Onboarding = ()=>{
const [formData, setFormData] = useState({
    user_id:"",
    first_name:'',
    last_name:'',
    dob_day:'',
    dob_month:'',
    dob_year:'',
    show_gender:false,
    gender_identity:'',
    gender_interest:'',
    email:'',
    url: '',
    about:'',
    matches:[]
})
    const handleChange=(e)=>{
        //console.log("e", e)
        const value = e.target.type=== 'checkbox' ? e.target.checked:e.target.value 
        const name = e.target.name
         //console.log('value: '+value ,'name: '+name )

         setFormData((prevState)=>({
            ...prevState, [name]:value
         }))
    }
    const handleSubmit=()=>{
        console.log("submit")
    }


    return(
        <>
            <Navbar setShowModal={()=>{}}
                    showModal={false}
                    authToken={true}
             />
             <div className="Onboarding">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="first_name">First Name</label>
                        <input id="first_name" type = "text" name="first_name" placeholder="First Name" required={true} value={formData.first_name} onChange={handleChange} />

                        <label htmlFor="last_name">Last Name</label>
                        <input id="last_name" type = "text" name="last_name" placeholder="Last Name" required={true} value={formData.last_name} onChange={handleChange} />

                        
                        <label>Birthday</label>
                        <div className="multiple-input-container">
                            <input id="dob_day" type = "number" name="dob_day" placeholder="DD" required={true} value={formData.dob_day} onChange={handleChange} />
                            <input id="dob_month" type = "number" name="dob_month" placeholder="MM" required={true} value={formData.dob_month} onChange={handleChange} />
                            <input id="dob_year" type = "number" name="dob_year" placeholder="YYYY" required={true} value={formData.dob_year} onChange={handleChange} />
                        </div>

                        
                        <label>Gender</label>
                        <div className="multiple-input-container">
                            <input id="man-gender-identity" type = "radio" name="gender_identity"  value="man" onChange={handleChange} checked={formData.gender_identity==='man'}/>
                            <label htmlFor="man-gender-identity">Man</label>

                            <input id="woman-gender-identity" type = "radio" name="gender_identity" value="woman" onChange={handleChange} checked={formData.gender_identity==='woman'}/>
                            <label htmlFor="woman-gender-identity">Woman</label>

                            <input id="more-gender-identity" type = "radio" name="gender_identity" value="more" onChange={handleChange} checked={formData.gender_identity==='more'}/>
                            <label htmlFor="more-gender-identity">More</label>
                        </div>

                        <label htmlFor="show-gender">Show gender on my profile.</label>
                        <input id="show-gender" type="checkbox" name="show-gender" onChange={handleChange} checked={formData.show_gender}/>

                        <label>Show Me</label>
                        <div className="multiple-input-container">
                            <input id="man-gender-interest" type = "radio" name="gender_interest"  value="man" onChange={handleChange} checked={formData.gender_interest==='man'}/>
                            <label htmlFor="man-gender-interest">Man</label>

                            <input id="woman-gender-interest" type = "radio" name="gender_interest" value="woman" onChange={handleChange} checked={formData.gender_interest==='woman'}/>
                            <label htmlFor="woman-gender-interest">Woman</label>

                            <input id="everyone-gender-interest" type = "radio" name="gender_interest" value="everyone" onChange={handleChange} checked={formData.gender_interest==='everyone'}/>
                            <label htmlFor="everyone-gender-interest">Everyone</label>
                        </div>

                        <label htmlFor="about">About Me</label>
                        <input id="about" type="text" name="about" required={true} placeholder="Write all about ypurself" value={formData.about} onChange={handleChange}/>
                        <input type="submit"/>
                    </section>

                    <section>
                        <label htmlFor="about">profile photo</label>
                        <input type="url" name="url" id="url" onChange={handleChange} required={true} />
                        <div className="photo-container">
                            {/* image url for testing: https://i.imgur.com/oPj4A8u.jpg */}
                            <img src={formData.url} alt="profile pic review"/>
                        </div>
                    </section>

                </form>

             </div>
        </>
    )
}

export default Onboarding