class Catalog
{
	constructor()
	{
		this.products=
		[
			{id:1,name:"Steamer",  code:"Steamer",	 image:"lguhdtv '",	description:"LG Electronics 49UK6300PUE 49-Inch 4K Ultra HD Smart LED TV (2018 Model)."		,price:34.97},
			{id:2,name:"Water Boiler", code:"Boiler", image:"sonytv.jpg"	,description:"Sony XBR55X900F 55-Inch 4K Ultra HD Smart LED TV with Alexa Compatibility "			,price:36.20 },
			{id:3,name:"Refrigerator", code:"Refrigerator", image:"sonytv.jpg"	,description:"Sony XBR55X900F 55-Inch 4K Ultra HD Smart LED TV with Alexa Compatibility "			,price:2996.00},
			{id:4,name:"Cup Food Chopper", code:"Chopper", image:"sonytv.jpg"	,description:"Sony XBR55X900F 55-Inch 4K Ultra HD Smart LED TV with Alexa Compatibility "			,price:49.00 }
		];
	}
	getItem(code)
	{
		 for (let i=0; i<this.products.length; i+=1)
		 {
			 if(this.products[i].code==code) return this.products[i];
		 } 
		 return null;
	}
	findItem(code)
	{
		for (let i=0; i<this.products.length; i+=1)
		{
			 if(this.products[i].code==code) return true;
		} 
		 return false;
	}
}

class ItemOrder 
{
	constructor(item) {this.item=item;this.numItems=1;}
	getItem(){return this.item;}
	setItem(item){this.item = item;}
	getNumItems(){return this.numItems;}
	setNumItems(n){this.numItems = n;}
	getItemId(){return((this.getItem()).id);}
	getItemCode(){return((this.getItem()).code);}
	getItemName(){return((this.getItem()).name);}
	getItemImage(){return ((this.getItem()).image); }
	getDescription(){return((this.getItem()).description);}
	getUnitCost(){return((this.getItem()).price).toFixed(2);}
	incrementNumItems(){this.setNumItems(parseInt(this.getNumItems()) + 1);}
	cancelOrder(){this.setNumItems(0);}
	getTotalCost(){return(parseInt(this.getNumItems()) * parseFloat(this.getUnitCost())).toFixed(2);} 
}

class ShoppingCart
{
	constructor(userid) 
	{
		this.userid=userid;
		this.itemsOrdered=[];
		this.loadCart();
	}
	getItemImage(id)
	{
		alert("In getItemImage:"+this.itemsOrdered.length);
		for (let i=0; i<this.itemsOrdered.length;++i) 
		{
			let item=this.itemsOrdered[i];
			alert(item.getItemId());
			if(item.getItemId()==id)
			{
				alert("Found Item:");
				return (this.itemsOrdered[i]).getItemImage();
			}
		}
		return '';
	}
	getItemsOrdered() {return this.itemsOrdered ;}
	printShoppingCart()
	{
		for (let i=0; i<this.itemsOrdered.length;++i) 
		{
			let item=this.itemsOrdered[i];
			alert("id="+item.getItemId()+ ": desc="+item.getDescription()+" qty="+item.getNumItems());
		}
	}
	addItem(itemCode) 
	{
		for (let i=0; i<this.itemsOrdered.length;++i) 
		{
			let item=this.itemsOrdered[i];
			if(item.getItemCode()==itemCode)
			{
				(this.itemsOrdered[i]).incrementNumItems();
				this.storeCart();
				return;
			}
		}	
		let catalog=new Catalog();
		let newOrder = new ItemOrder(catalog.getItem(itemCode));
		this.itemsOrdered.push(newOrder);
		this.storeCart();
	}
	setNumOrdered(itemCode,numOrdered) 
	{ 
		for (let i=0; i<this.itemsOrdered.length;++i) 
		{
			let item=this.itemsOrdered[i];
			if(item.getItemCode()==itemCode)
			{
				if(numOrdered<=0)
				{
					this.itemsOrdered.splice(i,1);
					this.storeCart();
					return;
				}
				else
				{
					(this.itemsOrdered[i]).setNumItems(numOrdered);
					this.storeCart();
					return;
				}
			}
		}
		let catalog=new Catalog();
		let newOrder = new ItemOrder(catalog.getItem(itemCode));
		newOrder.setNumItems(numOrdered);
		this.itemsOrdered.push(newOrder);
		this.storeCart();
	}
	getTotalCost()
	{
		let total=0;
		for (let i=0; i<this.itemsOrdered.length;++i) 
		{
			let item=this.itemsOrdered[i];
			total+=parseFloat(item.getTotalCost());
		}
		return total.toFixed(2);
	}
	addTax()
	{
		let total=parseFloat(this.getTotalCost());
		return (total*.1+total).toFixed(2);
	}

	addShipping(shipcost=0)
	{
	  return(parseFloat(this.addTax())+parseFloat(shipcost)).toFixed(2);
	}
	
	emptyShoppingCart()
	{
	    this.itemsOrdered=[];
	    var usercart=this.userid+"cart";  
	    setCookie(usercart,"",-1);
	}
	storeCart()
	{
		var usercart=this.userid+"cart";
		var cart="";
		var atleastone=false;
		let items=this.getItemsOrdered();
		for(let i=0;i<items.length;i++)
		{
			var qty=parseInt(items[i].getNumItems());
			if(qty>=1)
			{
				cart=cart+(items[i].getItemCode()+":"+qty+"@");
				atleastone=true;
			}
		}
		if(atleastone)
		{
			cart=cart.substring(0,cart.length-1);
			setCookie(usercart,cart,30);
		}
		else setCookie(usercart,"",-1);
	}
	loadCart()
	{
		let cartname=this.userid+"cart";
		let cart=getCookie(cartname);
		if(cart != null)
		{
			var str=cart.split("@");
			for(var i=0;i<str.length;i++)
			{
				var item=str[i].split(":");
				var cookiename=item[0];
				var cookievalue=item[1];
				this.setNumOrdered(cookiename,cookievalue);
			}		
		}
	}
}
