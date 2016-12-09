
var HTMLUtil = {
    Builder:function( obj )
    {
        this.parents = [];
        this.container = null;
        this.obj = obj;
    }
};

HTMLUtil.Builder.prototype = {
    append: function(member, e)
    {
        if ( this.container != null && e != null)
        {
            this.container.appendChild(e);
            if ( member != null && member != "" && this.obj != null )
            {
                this.obj[member] = e;
            }
        }
        return this;
    },
    addElement: function(member, element_type, properties)
    {
        var text_node = null;
        var save_text_node = false;

        if ( this.container != null )
        {
            var e = document.createElement(element_type);
            if ( properties != null )
            {


                for ( var p in properties )
                {
                    if ( p == '_text' )
                    {
                        text_node = document.createTextNode(properties[p]);
                        e.appendChild(text_node);
                    }
                    else if ( p == '_save_text_node' )
                    {
                        save_text_node = true;
                    }
                    else
                    {
                        e[p] = properties[p];
                    }
                }


            }
            this.container.appendChild(e);

            if ( member != null && member != "" && this.obj != null )
            {
                this.obj[member] = e;
                if ( save_text_node == true )
                {
                    if ( text_node == null )
                    {
                        text_node = document.createTextNode(' ');
                        e.appendChild(text_node);
                    }
                    this.obj[member+'_textnode'] = text_node;
                }
            }
        }
        return this;
    },
    addContainer:function(member, element_type, properties)
    {
        if ( this.container != null )
        {
            this.parents.push(this.container);
        }

        var e = document.createElement(element_type);
        if ( properties != null )
        {
            for ( var p in properties )
            {
                e[p] = properties[p];
            }
        }

        if ( this.container != null )
        {
            this.container.appendChild(e);
        }

        this.container = e;
        if ( member != null && member != "" && this.obj != null )
        {
            this.obj[member] = e;
        }

        return this;
    },
    endContainer:function()
    {
        this.container = this.parents.pop();
    }
};

var data = {};

var current_question = 0;

var answer_stat = null;

function onAnswerSelected()
{
    var correct_answer = questions[current_question].answer;

    var this_text = this.firstChild.nodeValue;

    if ( this_text == correct_answer )
    {
        data.answer_status_textnode.nodeValue = "Good!";
        window.setTimeout(function(){showQuestion(current_question + 1);}, 500);
    }
    else
    {
        data.answer_status_textnode.nodeValue = "Wrong answer";
    }

}

function showQuestion( q_number )
{
    data.answer_status_textnode.nodeValue = "Please Answer:";

    q_number = Math.min(Math.max(q_number, 0),questions.length-1);

    current_question = q_number;
    data.question_number_textnode.nodeValue = q_number+1;

    data.qdiv.innerHTML = '';

    var q = questions[q_number];

    var builder = new HTMLUtil.Builder(data);
    builder.container = data.qdiv;
    builder.addElement(null, 'p', {innerHTML:q.question});

    if ( q.image == true )
    {
        var iname = /^(.*?)\s/.exec(q.question)[1];
        builder.addElement(null, 'img', {src:'images/'+iname+'.png'});
    }

    if ( q.options != null )
    {
        var a = q.options;
        var buttonBuilder = new HTMLUtil.Builder(data);
        buttonBuilder.addContainer(null, 'div');

        builder.addContainer(null,'ul');
        for ( var n = 0; n < a.length; n++ )
        {
            builder.addElement(null, 'li', {_text:a[n]});
            buttonBuilder.addElement(null, 'button', {_text:a[n].charAt(0),onclick:onAnswerSelected,className:'option'});
        }
        builder.endContainer();
        builder.append(null, buttonBuilder.container);

    }
    else
    {
        builder.addContainer(null, 'div')
            .addElement(null, 'button', {_text:"Right",onclick:onAnswerSelected,className:'option'})
            .addElement(null, 'button', {_text:"Wrong",onclick:onAnswerSelected,className:'option'})
            .endContainer();
    }

}

function prev100Questions() { showQuestion(current_question - 100); }
function next100Questions() { showQuestion(current_question + 100); }
function prev10Questions()  { showQuestion(current_question -  10); }
function next10Questions()  { showQuestion(current_question +  10); }
function prevQuestion()     { showQuestion(current_question -   1); }
function nextQuestion()     { showQuestion(current_question +   1); }

function init()
{
    var builder = new HTMLUtil.Builder(data);
    builder.addContainer('main_container', 'div');

    builder.addContainer('button_container', 'div')
        .addElement('', 'button', {_text:'-100', onclick:prev100Questions, className:'number'})
        .addElement('', 'button', {_text:'-10',  onclick:prev10Questions , className:'number' })
        .addElement('', 'button', {_text:'-1',   onclick:prevQuestion , className:'number' })
        .addElement('question_number', 'span', {_text:'1', _save_text_node:true, className:'question_number'})
        .addElement('', 'button', {_text:'+1',   onclick:nextQuestion , className:'number' })
        .addElement('', 'button', {_text:'+10',  onclick:next10Questions , className:'number' })
        .addElement('', 'button', {_text:'+100', onclick:next100Questions , className:'number' })
        .endContainer();

    builder.addContainer('answer_status','div')
        .addElement('answer_status','span', {_text:'Select Answer', _save_text_node:true})
        .endContainer();

    builder.addContainer('qdiv','div');

    document.getElementById('testcontainer').appendChild(data.main_container);


    showQuestion(0);
}
