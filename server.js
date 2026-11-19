import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
const app=express(); app.use(express.json({limit:'1mb'}));
app.post('/api/chef',async(req,res)=>{
  const {ingredients=[],budget=100,diet='Vegetarian',craving='Any',region='Any', servings=2}=req.body||{};
  if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:'AI is not configured yet. Add OPENAI_API_KEY to .env. You can still use the local recipe collection.'});
  try{
    const prompt=`Create one practical Indian recipe based on these inputs. Ingredients available: ${ingredients.join(', ')||'none specified'}. Budget INR: ${budget}. Diet: ${diet}. Craving: ${craving}. Region: ${region}. Servings: ${servings}. Prefer listed ingredients and economical substitutions. Output JSON only with fields title, description, cuisine, servings, prepMinutes, cookMinutes, estimatedCostINR, ingredients (array of {name,quantity}), steps (array of strings), tips (array of strings).`;
    const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:'You are a helpful Indian home-cooking assistant. Keep recipes safe, clear, and realistic. Return valid JSON.'},{role:'user',content:prompt}],response_format:{type:'json_object'},temperature:0.7})});
    if(!response.ok){const detail=await response.text();return res.status(502).json({error:`AI provider error (${response.status}). ${detail.slice(0,300)}`});}
    const data=await response.json(); res.json(JSON.parse(data.choices[0].message.content));
  }catch(e){res.status(500).json({error:e.message||'Recipe generation failed'});}
});
const __dirname=path.dirname(fileURLToPath(import.meta.url));
if(process.env.NODE_ENV==='production'){app.use(express.static(path.join(__dirname,'dist')));app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'dist','index.html')));}
app.listen(process.env.PORT||8787,()=>console.log(`Tondara Tindi API running on http://localhost:${process.env.PORT||8787}`));
