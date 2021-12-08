
async function requestPage(url)
{
    let response=fetch(url);
    let responseList=response.then(result=>result.json());
     
    return responseList;
    
    
}

function Filter()
{
    this.filterTag=[];
    this.filterElement=document.getElementById("filter");
    this.filterTagTemplate=document.querySelector(".filterTag");
    this.filter;

    this.addFilterTag=function(value){


        if(this.filterTag.indexOf(value)==-1 && this.filterTag.length<5)
        {
        let newTag=this.filterTagTemplate.cloneNode(true);
      
        this.filterTag.push(value);
        newTag.id="";
        newTag.querySelector(".tag").innerHTML=value;
        newTag.querySelector(".removeTag").addEventListener("click",function(e){page.removeFilterTag(e.target.parentNode);});
        this.filterElement.appendChild(newTag);
        console.log(this.filterElement);


        }
       

    };

    

    this.removeFilterTag=function(element){


        let index=this.filterTag.indexOf(element.querySelector(".tag").innerHTML);
        this.filterTag.splice(index,1);
        this.filterElement.removeChild(element);

    };

    this.filter=function(page){

        let elementToFilter;

        if(this.filterTag.length>0)
        {
            elementToFilter=page.querySelectorAll(".listElement");
            
            console.log("filter1");
            for(let i=0;i<elementToFilter.length;i++)
            {
                if(elementToFilter[i].id!="listElementTemplate")
                {
                    this.matchFilter(elementToFilter[i]);
                }
            }

            
            this.display(this.filterElement,true);
            
        }
        else
        {
            
            this.display(this.filterElement,false);
        }
    };

    this.matchFilter=function(element)
    {
        let tags=element.querySelectorAll(".tag");
        let tagsLength=tags.length;
        let filterTagLength=this.filterTag.length;
        let match=true;

        

        for(let i=0;i<filterTagLength && match;i++)
        {
            match=false;
            // console.log(this.filterTag[i]);
            for(let j=0;j<tagsLength;j++)
            {
                // console.log(tags[j].innerHTML);
                if(tags[j].innerHTML==this.filterTag[i])
                {
                    match=true;
                }

            }

        }
        // console.log(match);

        this.display(element,match);
    };

    this.display=function(element,on){

        if(on)
        {
            element.style.display="flex";
        }
        else
        {
            element.style.display="none";

        }
    }


}

function ListElement()
{
    this.elementTemplate=document.getElementById("listElementTemplate");
    this.element=this.elementTemplate.cloneNode(true);
   

    this.fillElement=function(values){

        
        let i=0;

        for(let key in values)
        {
           
            this.setFunction[i](values[key],this);
            
            i++;

        }
  
      

       
    }

    this.setId=function(value,currentObject){

       

       currentObject.element.id="element"+value;

    };

    this.setCompany=function(value,currentObject){

        currentObject.element.querySelector(".firstLine span").innerHTML=value;

    };

    this.setLogo=function(value,currentObject){

        let url=value.substring(1,value.length);
      
        currentObject.element.querySelector(".logoPic").style.backgroundImage="url(\"assets"+url+"\")";



    };

    this.setNewTag=function(value,currentObject){

        if(value)
        {
            currentObject.element.querySelector(".newTag").style.display="block";
        }
        else
        {
            currentObject.element.querySelector(".newTag").style.display="none";

        }

    };

    this.setFeaturedTag=function(value,currentObject){

        if(value)
        {
            currentObject.element.querySelector(".featuredTag").style.display="block";
        }
        else
        {
            currentObject.element.querySelector(".featuredTag").style.display="none";

        }


    };

    this.setPosition=function(value,currentObject){

        currentObject.element.querySelector(".jobTitle").innerHTML=value;

    };

    this.setRole=function(value,currentObject){

        currentObject.addTag(value);

    };
    this.setLevel=function(value,currentObject){

        currentObject.addTag(value);


    };
    this.setPostedAt=function(value,currentObject){

        currentObject.element.querySelector(".postedAt").innerHTML=value;


    };

    this.setContract=function(value,currentObject){

        currentObject.element.querySelector(".contract").innerHTML=value;

    };
    this.setLocation=function(value,currentObject){

        currentObject.element.querySelector(".location").innerHTML=value;

    };
    this.setLanguages=function(list,currentObject){

        for(let i=0;i<list.length;i++)
        {
            currentObject.addTag(list[i]);
        }


    };
    this.setTools=function(list,currentObject){

        for(let i=0;i<list.length;i++)
        {
            currentObject.addTag(list[i]);
        }

    };

    this.addTag=function(value){
        let tag=document.createElement("div");
        let length=this.element.querySelector(".tagList").querySelectorAll(".tag").length;

        if(length<5)
        {
            tag.innerHTML=value;
            tag.className="tag";
            tag.addEventListener("click",function(e){page.addFilterTag(e.target);});
            this.element.querySelector(".tagList").appendChild(tag);
        }
    }

    this.setFunction=[this.setId,this.setCompany,this.setLogo,this.setNewTag,this.setFeaturedTag,this.setPosition,this.setRole,
        this.setLevel,this.setPostedAt,this.setContract,this.setLocation,this.setLanguages,this.setTools];

}

function Page()
{
    this.currentPage=1;
    this.elementPerPage=10;
    this.list;
    
    this.listElement;

    this.filter=new Filter();

    this.main=document.getElementById("main");
    this.element=document.getElementById("listElementTemplate");


    this.getPage=async function(){
        let result=await requestPage("js/data.json");
        
        this.setList(result);
        
    };
    this.setList=function(list){this.list=list;};


    this.displayPage= async function()
    {
       await this.getPage();
       
       this.setListElement();
       this.setPage();
       console.log(this.main);
       this.filter.filter(this.main);
       console.log(this.main);
       
           
    };

    this.setListElement=function(){

        let length=this.list.length;       
        let newElement;
        let elementList=[];

        for(let i=0;i<length;i++)
        {
            newElement=new ListElement();
            newElement.fillElement(this.list[i]);
            elementList.push(newElement.element);
        }

        this.listElement=elementList;
        

    };

    this.setPage=function(){

        let elementToDelete=this.main.querySelectorAll(".listElement");

        for(let i=0;i<elementToDelete.length;i++)
        {
            
            if(elementToDelete[i].id!="listElementTemplate")
            {
            this.main.removeChild(elementToDelete[i]);
            }
        }

        for(let i=0;i<this.listElement.length;i++)
        {
            this.main.appendChild(this.listElement[i]);
        }

    };

    this.addFilterTag=function(element){
        
        this.filter.addFilterTag(element.innerHTML);
        this.displayPage();
    };

    this.removeFilterTag=function(element){
        this.filter.removeFilterTag(element);
        this.displayPage();
    };



}

let page=new Page();
page.displayPage();


