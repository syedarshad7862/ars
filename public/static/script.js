/// Creating note and post to database
// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  btn.addEventListener("click", async()=>{
      let name = document.getElementById("name");
      let email = document.getElementById("email")
      console.log(title.value, note.value)
  
      let Portfolio ={
        'name': name.value,
        'email' : email.value
      }
      name.value="";
      email.value="";
  
  
      let resp = await postData('/contactData', Portfolio)
      console.log(resp)
  
    })