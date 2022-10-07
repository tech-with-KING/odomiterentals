const api =async()=>{
    const ret = await fetch("http://localhost:5500/articles")
    const bar = ret.json()
    console.log(bar)
}
api()
