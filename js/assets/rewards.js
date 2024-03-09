import * as sTools from "./stools.js";
import { SElement, createSElement } from "./selement.js";
import { evalTemplate, elementsFromTempalte} from "./evaltemplate.js";


const starsTpl = `
    <div class="stars-ct" data-eval="dom">
        <div class="stars-inner" data-eval="dom"></div>
    </div>
`;

/**
 * Addig fog érni az element1, ameddig az element2
 * @param {HTMLElement} element1 
 * @param {HTMLElement} element2 
 */
const setHeightToHeight = (element1, element2) => {
    element1.style.height = 
        ((element2.offsetHeight + element2.offsetTop) - element1.offsetTop) + 'px';
}

const rewards = (o) => {

    const parentElement = sTools.getElement(o.parentElement);
    const statusDisplay = sTools.getElement(o.statusDisplay);
    let layerElement;

    const goodJob = () => {

    }

    const layer = (pElement = parentElement) => {
        return new Promise(function(resolve, reject){

            const element = document.createElement('div');
            layerElement = element;

            element.addEventListener('animationend', () => {
                resolve(element);
            });

            element.style.height = pElement.offsetHeight+'px';
            element.className = 'reward-layer layerfadein';

            pElement.appendChild(element);
        });
    }

    const rewardAnim = async (cssName, animName, options = {
        hideAfterFinish: true
    }) => {

        const element = document.createElement('div');

        const parent = await layer(
            !options.hideAfterFinish ? parentElement.firstElementChild : parentElement
        );

        parent.appendChild(element);

        return new Promise( (resolve, reject) => {

            element.addEventListener('animationend', () => {
                if (!options.hideAfterFinish){
                    resolve(element);
                }
            });
    
            element.className = 'reward ' + cssName + ' ' + animName;

            if (options.hideAfterFinish)
                setTimeout(() => {
                    parent.remove();
                    resolve();
                }, 1600);
        });
    }

    const correct = () => {
        rewardAnim('line-correct', 'zoomin');
    }

    const incorrect =() => {
        rewardAnim('line-incorrect', 'zoomin');
    }

    const success = async () => {
        await rewardAnim('all-success', 'zoomin', {
            hideAfterFinish: false
        });
    }

    const finished = async () => {
        await rewardAnim('all-finished', 'zoomin', {
            hideAfterFinish: false
        });
    }

    const failed = () => {

    }

    const addStars = (starNumber) => {
        const {starsCt, starsInner} = elementsFromTempalte(starsTpl);
        statusDisplay.appendChild(starsCt);

        const stars = [];

        console.log(starsCt);

        for (let i = 0; i < starNumber; i++){
            const star = sTools.createElement({
                tagName: 'span',
                className: 'reward-star'
            });

            starsInner.appendChild(star);

            stars.push(star);
        }

        stars.reverse().slice(1).every( (star, i) => {
            console.log(star);
            stars[i].addEventListener("animationend", () => {
                star.classList.add('zoomout');
            });
            return true;
        });

        stars[0].classList.add('zoomout');
    }

    return {
        correct, incorrect, success, failed, addStars, goodJob, finished,
        get layer(){
            return layerElement;
        }
    }

};

export { rewards }